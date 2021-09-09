import { HttpRequestParams, HttpResponse } from 'enonic-types/http'
import { Request, Response } from 'enonic-types/controller'
import { Dataset, JSONstat as jsonStatObject } from '../../lib/types/jsonstat-toolkit'
import { Content } from 'enonic-types/content'
import { DatasetRepoNode } from '../../lib/ssb/repo/dataset'
import { DataSource } from '../../site/mixins/dataSource/dataSource'
import { datasetOrUndefined } from '../../lib/ssb/cache/cache'
import { TbmlDataUniform } from '../../lib/types/xmlParser'


/* eslint-disable new-cap */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import JSONstat from 'jsonstat-toolkit/import.mjs'

const {
  get
} = __non_webpack_require__('/lib/xp/content')

import validator from 'validator'
const {
  request
} = __non_webpack_require__('/lib/http-client')

export function getName(req: Request): Response {
  if (!req.params.name) {
    return {
      body: {
        message: 'name parameter missing'
      },
      contentType: 'application/json'
    }
  }

  const solrBaseUrl: string = app.config && app.config['ssb.solrNameSearch.baseUrl'] ?
    app.config['ssb.solrNameSearch.baseUrl'] : 'https://www.ssb.no/solr/navnesok/select'

  const requestParams: HttpRequestParams = {
    url: solrBaseUrl,
    method: 'get',
    contentType: 'application/json',
    headers: {
      'Cache-Control': 'no-cache',
      'Accept': 'application/json'
    },
    connectionTimeout: 20000,
    readTimeout: 5000,
    params: {
      q: prepareQuery(sanitizeQuery(req.params.name)),
      wt: 'json'
    }
  }

  try {
    const result: HttpResponse = request(requestParams)
    const preparedBody: string = result.body ? prepareResult(result.body, sanitizeQuery(req.params.name)) : ''

    return {
      body: preparedBody,
      status: result.status,
      contentType: 'application/json'
    }
  } catch (err) {
    log.error(`Failed to fetch data from solr name search: ${solrBaseUrl}. ${err}`)

    return {
      body: err,
      status: err.status ? err.status : 500,
      contentType: 'application/json'
    }
  }
}

function prepareResult(result: string, name: string): string {
  const obj: ResultType = JSON.parse(result)
  obj.originalName = name
  obj.nameGraph = prepareGraph(name)
  return JSON.stringify(obj)
}

function prepareGraph(name: string): Array<NameGraph> {
  const jsonData: Content<DataSource> | null = get({
    // key: 'fc606ea3-17a6-4408-b277-14ac8bb78b3c'
    key: '11af3826-30e6-4022-963f-93dde27b22d2'
  })

  let bankSaved: DatasetRepoNode<object | JSONstat | TbmlDataUniform> | undefined = undefined

  if (!!jsonData) {
    bankSaved = datasetOrUndefined(jsonData)
  }

  // const set: string | jsonstatType | undefined = bankSaved?.data
  // const label: string = set.Data(0).label
  // const label: string | undefined = JSONstat(bankSaved?.data).Dataset(0)
  // let label: Dataset
  let dataset: Keyable


  try {
    const labels: Keyable = bankSaved?.data.dimension.Fornavn.category.label
    const nameCode: string | undefined = getKeyByValue(labels, 'Anna')
    dataset = JSONstat(bankSaved?.data).Dataset(0).Dice({
      'Fornavn': [nameCode]
    })
  } catch (error) {
    dataset = error
  }

  // prepareHighchartsData(req, )

  log.info( 'GLNRBN dataset: ' + dataset.value )


  return [{
    individualName: 'Elin',
    nameStatistics: [1, 2, 3, 4]
  }]
}


function getKeyByValue(object: Keyable, value: string): string | undefined {
  return Object.keys(object).find((key) => object[key] === value)
}


function prepareQuery(input: string): string {
  if (input.split(' ').length == 1) return input
  else return pad(input) + '+' + input.split(' ').map((word) => pad(word)).join('+')
}

function pad(word: string): string {
  return '"' + word + '"'
}

function sanitizeQuery(name: string): string {
  const approved: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ '
  return validator.whitelist(replaceCharacters(name.toUpperCase()), approved )
}

function replaceCharacters(name: string): string {
  return name.replace('É', 'E')
    .replace('È', 'E')
    .replace('Ô', 'O')
    .replace("'", '')
    .replace('Ä', 'Æ')
    .replace('Ü', 'Y')
    .replace('Ö', 'Ø')
}

interface ResultType {
  originalName: string;
  nameGraph?: Array<NameGraph>;
}

interface NameGraph {
  individualName: string;
  nameStatistics: Array<number>;
}


interface NameData {
  fornavn: Dataset | null;
  tid: Dataset | null;
}


interface Keyable {
  [key: string]: string;
}

