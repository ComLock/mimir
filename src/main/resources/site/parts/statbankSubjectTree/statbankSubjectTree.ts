import { Request } from 'enonic-types/controller'
import { React4xp, React4xpResponse } from '../../../lib/types/react4xp'
import { SubjectItem, StatisticItem } from '../../../lib/ssb/utils/subjectUtils'
import { Content } from 'enonic-types/content'
import { StatisticInListing } from '../../../lib/ssb/dashboard/statreg/types'
const {
  getMainSubjects,
  getSubSubjects,
  getSubSubjectsByPath,
  getStatistics,
  getStatisticsByPath,
  getEndedStatisticsByPath,
  getSecondaryStatisticsBySubject
} = __non_webpack_require__( '/lib/ssb/utils/subjectUtils')
const {
  getAllStatisticsFromRepo
} = __non_webpack_require__('/lib/ssb/statreg/statistics')
const React4xp: React4xp = __non_webpack_require__('/lib/enonic/react4xp')
const {
  getContent
} = __non_webpack_require__('/lib/xp/portal')
const {
  ensureArray
} = __non_webpack_require__('/lib/ssb/utils/arrayUtils')

export function get(req: Request): React4xpResponse {
  const isNotInEditMode: boolean = req.mode !== 'edit'
  const content: Content = getContent()
  const language: string = content.language === 'en' ? 'en' : 'no'
  const allMainSubjects: Array<SubjectItem> = getMainSubjects(content.language)
  const allSubSubjects: Array<SubjectItem> = getSubSubjects()
  const statregStatistics: Array<StatisticInListing> = ensureArray(getAllStatisticsFromRepo())
  const statistics: Array<StatisticItem> = getStatistics(statregStatistics)
  const baseUrl: string = app.config && app.config['ssb.baseUrl'] ? app.config['ssb.baseUrl'] : 'https://www.ssb.no'
  const statbankBaseUrl: string = content.language && content.language === 'en' ? baseUrl + '/en/statbank/list/' : baseUrl + '/statbank/list/'
  const mainSubjects: Array<MainSubjectWithSubs> = allMainSubjects.map( (subjectItem) => {
    const subSubjectsFromPath: Array<SubjectItem> = getSubSubjectsByPath(allSubSubjects, subjectItem.path)
    const preparedSubSubjects: Array<SubSubjectsWithStatistics> = subSubjectsFromPath.map((subSubject) =>
      prepareSubSubjects(subSubject, statregStatistics, statistics, language))
    return {
      ...subjectItem,
      subSubjects: preparedSubSubjects
    }
  })

  const props: ReactProps = {
    statbankBaseUrl,
    mainSubjects
  }
  return React4xp.render('site/parts/statbankSubjectTree/statbankSubjectTree', props, req, {
    clientRender: isNotInEditMode
  })
}

function prepareSubSubjects(subSubject: SubjectItem,
  statregStatistics: Array<StatisticInListing>,
  statistics: Array<StatisticItem>,
  language: string): SubSubjectsWithStatistics {
  const statisticItems: Array<StatisticItem> = getStatisticsByPath(statistics, subSubject.path).filter((s) => s.hideFromList !== true)

  const preparedStatistics: PreparedSubs['statistics'] = []
  statisticItems.forEach((s) => {
    const lang: string = language === 'en' ? 'en' : 'no'
    const title: string = s.titles.filter((t)=> t.language === lang)[0].title
    preparedStatistics.push(
      {
        title: title,
        url: s.shortName
      }
    )
  })

  const pathEndedStatisticNo: string = subSubject.path.replace('/ssb/en/', '/ssb/')
  const endedStatistics: Array<StatisticItem> = getEndedStatisticsByPath(pathEndedStatisticNo, statregStatistics, true)
  const preparedEndedStatistics: PreparedSubs['statistics'] = endedStatistics.length > 0 ? endedStatistics.map((e) => {
    const lang: string = language === 'en' ? 'en' : 'no'
    const title: string = e.titles.filter((t)=> t.language === lang)[0].title
    return {
      title: title,
      url: e.shortName
    }
  }) : []

  const secondaryStatistics: Array<StatisticItem> = getSecondaryStatisticsBySubject(statistics, subSubject)

  const preparedSecondaryStatistics: PreparedSubs['statistics'] = secondaryStatistics.length > 0 ? secondaryStatistics.map((e) => {
    const lang: string = language === 'en' ? 'en' : 'no'
    const title: string = e.titles.filter((t)=> t.language === lang)[0].title
    return {
      title: title,
      url: e.shortName
    }
  }) : []

  const allStatistics: PreparedSubs['statistics'] = [...preparedStatistics, ...preparedEndedStatistics, ...preparedSecondaryStatistics]
    .sort((a, b) => (a.title > b.title) ? 1 : -1)
  return {
    ...subSubject,
    statistics: allStatistics
  }
}

type MainSubjectWithSubs = SubjectItem & SubSubs

type SubSubjectsWithStatistics = SubjectItem & PreparedSubs

interface SubSubs {
  subSubjects: Array<PreparedSubs>;
}

interface PreparedSubs {
  statistics: Array<{title: string; url: string}>;
}

interface ReactProps {
  statbankBaseUrl: string;
  mainSubjects: Array<MainSubjectWithSubs>;
}
