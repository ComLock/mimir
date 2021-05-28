import { StatisticInListing, VariantInListing } from '../dashboard/statreg/types'
import { I18nLibrary } from 'enonic-types/i18n'
import { DateUtilsLib } from './dateUtils'
import { Moment } from '../../vendor/moment'

const {
  getMainSubject
} = __non_webpack_require__( './parentUtils')
const {
  sameDay
}: DateUtilsLib = __non_webpack_require__( '/lib/ssb/utils/dateUtils')
const {
  localize
}: I18nLibrary = __non_webpack_require__( '/lib/xp/i18n')
const {
  groupBy
} = __non_webpack_require__('/lib/vendor/ramda')
const {
  getWeek
} = __non_webpack_require__('/lib/ssb/utils/utils')
const {
  data: {
    forceArray
  }
} = __non_webpack_require__( '/lib/util')
const {
  moment
}: Moment = __non_webpack_require__('/lib/vendor/moment')

export function calculatePeriod(variant: VariantInListing, language: string): string {
  switch (variant.frekvens) {
  case 'År':
    return calculateYear(variant, language)
  case 'Halvår':
    return calcualteHalfYear(variant, language)
  case 'Termin':
    return calculateTerm(variant, language)
  case 'Kvartal':
    return calculateQuarter(variant, language)
  case 'Måned':
    return calculateMonth(variant, language)
  case 'Uke':
    return calculateWeek(variant, language)
  default:
    return calculateEveryXYear(variant, language)
  }
}

function calculateEveryXYear(variant: VariantInListing, language: string): string {
  const dateFrom: Date = new Date(variant.previousFrom)
  const dateTo: Date = new Date(variant.previousTo)
  const yearFrom: number = dateFrom.getFullYear()
  const yearTo: number = dateTo.getFullYear()

  if (yearFrom !== yearTo) {
    return localize({
      key: 'period.generic',
      locale: language,
      values: [`${yearFrom.toString()}-${yearTo.toString()}`]
    })
  } else {
    // spesialtilfelle hvis periode-fra og periode-til er i samme år
    return localize({
      key: 'period.generic',
      locale: language,
      values: [yearTo.toString()]
    })
  }
}

function calculateYear(variant: VariantInListing, language: string): string {
  const dateFrom: Date = new Date(variant.previousFrom)
  const dateTo: Date = new Date(variant.previousTo)
  const yearFrom: number = dateFrom.getFullYear()
  const yearTo: number = dateTo.getFullYear()
  if ( (yearFrom + 1) === yearTo &&
        dateFrom.getDate() !== 1 &&
        dateFrom.getMonth() !== 0 &&
        dateTo.getDate() !== 31 &&
        dateTo.getMonth() !== 11) {
    // spesialtilfelle hvis periode-fra og periode-til er kun ett år mellom og startdato ikke er 01.01
    return localize({
      key: 'period.generic',
      locale: language,
      values: [`${yearFrom.toString()}/${yearTo.toString()}`]
    })
  } else if (yearFrom !== yearTo ) {
    // spesialtilfelle hvis periode-fra og periode-til er i ulike år
    return localize({
      key: 'period.generic',
      locale: language,
      values: [`${yearFrom.toString()}-${yearTo.toString()}`]
    })
  } else {
    return localize({
      key: 'period.generic',
      locale: language,
      values: [yearTo.toString()]
    })
  }
}

function calcualteHalfYear(variant: VariantInListing, language: string): string {
  const date: Date = new Date(variant.previousFrom)
  const fromMonth: number = new Date(variant.previousFrom).getMonth() + 1
  const halfyear: number = Math.ceil(fromMonth / 6)
  return localize({
    key: 'period.halfyear',
    locale: language,
    values: [halfyear.toString(), date.getFullYear().toString()]
  })
}

function calculateTerm(variant: VariantInListing, language: string): string {
  const date: Date = new Date(variant.previousFrom)
  const fromMonth: number = date.getMonth() + 1
  const termin: number = Math.ceil(fromMonth / 6)
  return localize({
    key: 'period.termin',
    locale: language,
    values: [termin.toString(), date.getFullYear().toString()]
  })
}

function calculateQuarter(variant: VariantInListing, language: string): string {
  const date: Date = new Date(variant.previousFrom)
  const fromMonth: number = date.getMonth() + 1
  const quarter: number = Math.ceil(fromMonth / 3)
  return localize({
    key: 'period.quarter',
    locale: language,
    values: [quarter.toString(), date.getFullYear().toString()]
  })
}

function calculateMonth(variant: VariantInListing, language: string): string {
  const monthName: string = moment(variant.previousFrom).locale(language).format('MMMM')
  const year: string = moment(variant.previousFrom).locale(language).format('YYYY')
  return localize({
    key: 'period.month',
    locale: language,
    values: [monthName, year]
  })
}

function calculateWeek(variant: VariantInListing, language: string): string {
  const date: Date = new Date(variant.previousFrom)
  return localize({
    key: 'period.week',
    locale: language,
    values: [getWeek(date).toString(), date.getFullYear().toString()]
  })
}


export function addMonthNames(groupedByYearMonthAndDay: GroupedBy<GroupedBy<GroupedBy<PreparedStatistics>>>, language: string): Array<YearReleases> {
  return Object.keys(groupedByYearMonthAndDay).map((year) => {
    const tmpYear: GroupedBy<GroupedBy<PreparedStatistics>> = groupedByYearMonthAndDay[year] as GroupedBy<GroupedBy<PreparedStatistics>>
    const monthReleases: Array<MonthReleases> = Object.keys(tmpYear).map((monthNumber) => {
      const tmpMonth: GroupedBy<PreparedStatistics> = tmpYear[monthNumber] as GroupedBy<PreparedStatistics>
      const dayReleases: Array<DayReleases> = Object.keys(tmpYear[monthNumber]).map((day) => {
        return {
          day,
          releases: forceArray(tmpMonth[day])
        }
      })

      const a: MonthReleases = {
        month: monthNumber,
        monthName: moment().locale(language).set({
          year: parseInt(year),
          month: parseInt(monthNumber),
          date: 2
        })
          .format('MMM'),
        releases: dayReleases
      }
      return a
    })

    return {
      year,
      releases: monthReleases
    }
  })
}


export const groupStatisticsByYear: (statistics: Array<PreparedStatistics>) => GroupedBy<PreparedStatistics> = groupBy(
  (statistic: PreparedStatistics): string => {
    return statistic.variant.year.toString()
  }
)

export const groupStatisticsByMonth: (statistics: Array<PreparedStatistics>) => GroupedBy<PreparedStatistics> = groupBy(
  (statistic: PreparedStatistics): string => {
    return statistic.variant.monthNumber.toString()
  }
)

export const groupStatisticsByDay: (statistics: Array<PreparedStatistics>) => GroupedBy<PreparedStatistics> = groupBy(
  (statistic: PreparedStatistics): string => {
    return statistic.variant.day.toString()
  }
)

// group by year, then month, then day
export function groupStatisticsByYearMonthAndDay(releasesPrepped: Array<PreparedStatistics>):
    GroupedBy<GroupedBy<GroupedBy<PreparedStatistics>>> {
  const groupedByYear: GroupedBy<PreparedStatistics> = groupStatisticsByYear(releasesPrepped)
  const groupedByYearMonthAndDay: GroupedBy<GroupedBy<GroupedBy<PreparedStatistics>>> = {}
  Object.keys(groupedByYear).forEach((year) => {
    const groupedByMonthAndDay: GroupedBy<GroupedBy<PreparedStatistics>> = {}
    const tmpMonth: GroupedBy<PreparedStatistics> = groupStatisticsByMonth(forceArray(groupedByYear[year]))
    Object.keys(tmpMonth).map((month) => {
      groupedByMonthAndDay[month] = groupStatisticsByDay(forceArray(tmpMonth[month]))
    })
    groupedByYearMonthAndDay[year] = groupedByMonthAndDay
  })

  return groupedByYearMonthAndDay
}


export function getReleasesForDay(
  statisticList: Array<StatisticInListing>,
  day: Date,
  property: keyof VariantInListing = 'previousRelease'
): Array<StatisticInListing> {
  return statisticList.reduce((acc: Array<StatisticInListing>, stat: StatisticInListing) => {
    const thisDayReleasedVariants: Array<VariantInListing> | undefined = Array.isArray(stat.variants) ?
      stat.variants.filter((variant: VariantInListing) => {
        return checkVariantReleaseDate(variant, day, property)
      }) :
      checkVariantReleaseDate(stat.variants, day, property) ? [stat.variants] : undefined
    if (thisDayReleasedVariants && thisDayReleasedVariants.length > 0) {
      acc.push({
        ...stat,
        variants: thisDayReleasedVariants
      })
    }
    return acc
  }, [])
}

export function filterOnComingReleases(stats: Array<StatisticInListing>, count: number, startDay: number = 0): Array<StatisticInListing> {
  log.info('filterOnComingReleases')
  log.info(JSON.stringify(stats, null, 2))
  log.info(JSON.stringify(count, null, 2))
  log.info(JSON.stringify(startDay, null, 2))
  const releases: Array<StatisticInListing> = []
  for (let i: number = startDay; i < startDay + count; i++) {
    const day: Date = new Date()
    day.setDate(day.getDate() + i)
    log.info(JSON.stringify(day, null, 2))
    const releasesOnThisDay: Array<StatisticInListing> = getReleasesForDay(stats, day, 'nextRelease')
    releases.push(...releasesOnThisDay)
  }
  log.info(JSON.stringify('done: returning :releases', null, 2))
  log.info(JSON.stringify(releases, null, 2))

  return releases
}

export function checkVariantReleaseDate(variant: VariantInListing, day: Date, property: keyof VariantInListing): boolean {
  const dayFromVariant: string = variant[property] as string
  return sameDay(new Date(dayFromVariant), day)
}

export function prepareRelease(release: StatisticInListing, language: string, property: keyof VariantInListing = 'previousRelease' ): PreparedStatistics {
  const preparedVariant: PreparedVariant = Array.isArray(release.variants) ?
    concatReleaseTimes(release.variants, language, property) :
    formatVariant(release.variants, language, property)
  return {
    id: release.id,
    name: language === 'en' ? release.nameEN : release.name,
    shortName: release.shortName,
    type: localize({
      key: 'statistic',
      locale: language
    }),
    mainSubject: getMainSubject(release.shortName, language),
    variant: preparedVariant
  }
}

function concatReleaseTimes(variants: Array<VariantInListing>, language: string, property: keyof VariantInListing): PreparedVariant {
  const defaultVariant: PreparedVariant = formatVariant(variants[0], language, property)
  const timePeriodes: Array<string> = variants.map((variant: VariantInListing) => calculatePeriod(variant, language))
  const formatedTimePeriodes: string = timePeriodes.join(` ${localize({
    key: 'and',
    locale: language
  })} `)
  return {
    ...defaultVariant,
    period: formatedTimePeriodes
  }
}

function formatVariant(variant: VariantInListing, language: string, property: keyof VariantInListing): PreparedVariant {
  const variantProperty: string = variant[property] as string
  const date: Date = new Date(variantProperty)
  return {
    id: variant.id,
    day: date.getDate(),
    monthNumber: date.getMonth(),
    year: date.getFullYear(),
    frequency: variant.frekvens,
    period: calculatePeriod(variant, language)
  }
}


export interface VariantUtilsLib {
  calculatePeriod: (variant: VariantInListing, language: string) => string;
  addMonthNames: (groupedByYearMonthAndDay: GroupedBy<GroupedBy<GroupedBy<PreparedStatistics>>>, language: string) => Array<YearReleases>;
  groupStatisticsByYear: (statistics: Array<PreparedStatistics>) => GroupedBy<PreparedStatistics>;
  groupStatisticsByMonth: (statistics: Array<PreparedStatistics>) => GroupedBy<PreparedStatistics>;
  groupStatisticsByDay: (statistics: Array<PreparedStatistics>) => GroupedBy<PreparedStatistics>;
  groupStatisticsByYearMonthAndDay: (releasesPrepped: Array<PreparedStatistics>) => GroupedBy<GroupedBy<GroupedBy<PreparedStatistics>>>;
  getReleasesForDay: (statisticList: Array<StatisticInListing>, day: Date, property?: keyof VariantInListing) => Array<StatisticInListing>;
  prepareRelease: (release: StatisticInListing, locale: string, property?: keyof VariantInListing) => PreparedStatistics;
  filterOnComingReleases: (stats: Array<StatisticInListing>, daysInTheFuture: number, startDay?: number) => Array<StatisticInListing>;
}


export interface PreparedStatistics {
  id: number;
  name: string;
  shortName: string;
  variant: PreparedVariant;
  type?: string;
  date?: string;
  mainSubject?: string;
}

export interface PreparedVariant {
  id: string;
  day: number;
  monthNumber: number;
  year: number;
  frequency: string;
  period: string;
}

export interface DayReleases {
  day: string;
  releases: Array<PreparedStatistics>;
}

export interface MonthReleases {
  month: string;
  monthName: string;
  releases: Array<DayReleases>;
}

export interface YearReleases {
  year: string;
  releases: Array<MonthReleases>;
}

export interface GroupedBy<T> {
  [key: string]: Array<T> | T;
}

