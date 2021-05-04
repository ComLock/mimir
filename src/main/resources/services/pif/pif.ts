import { Content } from 'enonic-types/content'
import { Response } from 'enonic-types/controller'
import { HttpRequestParams } from 'enonic-types/http'
import { CalculatorConfig } from '../../site/content-types/calculatorConfig/calculatorConfig'
import { Dataset } from '../../lib/types/jsonstat-toolkit'
import { CalculatorLib } from '../../lib/ssb/dataset/calculator'
import { I18nLibrary } from 'enonic-types/i18n'
const i18nLib: I18nLibrary = __non_webpack_require__('/lib/xp/i18n')
const {
  getCalculatorConfig, getPifDataset
}: CalculatorLib = __non_webpack_require__('/lib/ssb/dataset/calculator')

function get(req: HttpRequestParams): Response {
  const scopeCode: string | undefined = req.params?.scopeCode || '2'
  const productGroup: string | undefined = req.params?.productGroup || 'SITCT'
  const startValue: string | undefined = req.params?.startValue
  const startMonth: string | undefined = req.params?.startMonth || ''
  const startYear: string | undefined = req.params?.startYear
  const endMonth: string | undefined = req.params?.endMonth || ''
  const endYear: string | undefined = req.params?.endYear
  const language: string | undefined = req.params?.language ? req.params.language : 'nb'
  const errorValidateStartMonth: string = i18nLib.localize({
    key: 'pifServiceValidateStartMonth',
    locale: language
  })
  const errorValidateEndMonth: string = i18nLib.localize({
    key: 'pifServiceValidateEndMonth',
    locale: language
  })

  if (!scopeCode || !startValue || !productGroup || !startYear || !endYear) {
    return {
      status: 400,
      body: {
        error: 'missing parameter'
      },
      contentType: 'application/json'
    }
  }

  const config: Content<CalculatorConfig> | undefined = getCalculatorConfig()

  if (config && config.data.pifSource) {
    const pifDataset: Dataset | null = getPifDataset(config)
    const indexResult: IndexResult = getIndexes(scopeCode, productGroup, startMonth, startYear, endMonth, endYear, pifDataset)
    const chronological: boolean = isChronological(startYear, startMonth, endYear, endMonth)
    if (indexResult.startIndex !== null && indexResult.endIndex !== null) {
      // const changeValue: number = getChangeValue(indexResult.startIndex, indexResult.endIndex, chronological)
      return {
        body: {
          startIndex: indexResult.startIndex,
          endIndex: indexResult.endIndex
        },
        contentType: 'application/json'
      }
    } else {
      return {
        status: 500,
        body: {
          error: indexResult.startIndex === null ? errorValidateStartMonth : errorValidateEndMonth
        },
        contentType: 'application/json'
      }
    }
  }
  return {
    status: 500,
    body: {
      error: 'missing calculator config or pif sources'
    },
    contentType: 'application/json'
  }
}
exports.get = get

function getIndexes(scopeCode: string,
  productGroup: string,
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  pifData: Dataset | null
): IndexResult {
  const start: string = startMonth !== '' ? startYear + 'M' + startMonth : startYear
  const end: string = endMonth !== '' ? endYear + 'M' + endMonth : endYear

  const startIndex: null | number = start.length == 4 ? getAverageYear(pifData, startYear, scopeCode, productGroup) :
    getIndexTime(pifData, start, scopeCode, productGroup)

  const endIndex: null | number = end.length == 4 ? getAverageYear(pifData, endYear, scopeCode, productGroup) :
    getIndexTime(pifData, end, scopeCode, productGroup)

  return {
    startIndex,
    endIndex
  }
}

interface IndexResult {
    startIndex: number | null;
    endIndex: number | null;
}

function isChronological(startYear: string, startMonth: string, endYear: string, endMonth: string): boolean {
  if (parseInt(startYear) < parseInt(endYear)) return true
  if (parseInt(endYear) < parseInt(startYear)) return false

  if (startMonth != '' && endMonth != '') {
    if (parseInt(startMonth) < parseInt(endMonth)) return true
    if (parseInt(startMonth) > parseInt(endMonth)) return false
  }
  return true
}

function getAverageYear(dataPif: Dataset | null, year: string, scopeCode: string, productGroup: string ): null | number {
  let totalValue: number = 0
  let countMonth: number = 0

  for (let m: number = 1; m <= 12; m++) {
    // TODO: Finne en bedre måte
    const month: string = m.toString().length < 2 ? '0' + m.toString() : m.toString()
    const time: string = year + 'M' + month
    const indeks: null | number = getIndexTime(dataPif, time, scopeCode, productGroup)

    if (indeks != null) {
      totalValue = totalValue + indeks
      countMonth++
    }
  }

  if (countMonth != 12) {
    return null
  }

  return totalValue / countMonth
}

function getIndexTime(pifData: Dataset | null, time: string, scopeCode: string, productGroup: string ): number | null {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const index: null | number = pifData?.Data({
    Tid: time,
    Marked: scopeCode,
    SITC: productGroup
  }).value

  return index
}
