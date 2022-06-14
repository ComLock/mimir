import { Request, Response } from 'enonic-types/controller'
import { Component } from 'enonic-types/portal'
import { Content } from 'enonic-types/content'
import { SearchResultPartConfig } from './searchResult-part-config'
import { React4xp, React4xpResponse } from '../../../lib/types/react4xp'
import { PreparedSearchResult, SolrPrepResultAndTotal } from '../../../lib/ssb/utils/solrUtils'
import { SubjectItem } from '../../../lib/ssb/utils/subjectUtils'
import { queryNodes, getNode } from '../../../lib/ssb/repo/common'
import { NodeQueryResponse, RepoNode } from 'enonic-types/node'
import { formatDate } from '../../../lib/ssb/utils/dateUtils'
import { BestBetContent } from '../../../lib/ssb/repo/bestbet'

const React4xp: React4xp = __non_webpack_require__('/lib/enonic/react4xp')
const {
  solrSearch
} = __non_webpack_require__('/lib/ssb/utils/solrUtils')
const {
  getComponent,
  getContent,
  pageUrl,
  serviceUrl
} = __non_webpack_require__('/lib/xp/portal')
const {
  renderError
} = __non_webpack_require__('/lib/ssb/error/error')
const {
  sanitizeForSolr
} = __non_webpack_require__('/lib/ssb/utils/textUtils')
const {
  localize
} = __non_webpack_require__('/lib/xp/i18n')
const {
  getPhrases
} = __non_webpack_require__('/lib/ssb/utils/language')
const {
  getMainSubjects
} = __non_webpack_require__( '/lib/ssb/utils/subjectUtils')
const {
  isEnabled
} = __non_webpack_require__('/lib/featureToggle')
const {
  get
} = __non_webpack_require__('/lib/xp/content')

exports.get = function(req: Request): React4xpResponse | Response {
  try {
    return renderPart(req)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

exports.preview = (req: Request): React4xpResponse | Response => {
  try {
    return renderPart(req)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

export function renderPart(req: Request): React4xpResponse {
  /* collect data */
  const content: Content = getContent()
  const part: Component<SearchResultPartConfig> = getComponent()
  const sanitizedTerm: string = req.params.sok ? sanitizeForSolr(req.params.sok) : ''
  const searchPageUrl: string = part.config.searchResultPage ? pageUrl({
    id: part.config.searchResultPage
  }) : content._path
  const count: number = part.config.numberOfHits ? parseInt(part.config.numberOfHits) : 15
  const language: string = content.language ? content.language : 'nb'
  const phrases: {[key: string]: string} = getPhrases(content)
  const mainSubjects: Array<SubjectItem> = getMainSubjects(req, language)
  const mainSubjectDropdown: Array<Dropdown> = [
    {
      id: 'allSubjects',
      title: phrases['publicationArchive.allSubjects']
    }
  ].concat(mainSubjects.map((subject) => {
    return {
      id: subject.name,
      title: subject.title
    }
  }))

  function getContentTypes(solrResults: Array<string | number>): Array<Dropdown> {
    const validFilters: Array<string> = ['artikkel', 'statistikk', 'faktaside', 'statistikkbanktabell', 'publikasjon']
    const filters: Array<string | number> = solrResults
      .filter((value) => typeof value == 'string')
      .filter((value) => validFilters.includes(value as string))

    const dropdowns: Array<Dropdown> = [
      {
        id: 'allTypes',
        title: phrases['publicationArchive.allTypes']
      }
    ].concat(filters.map((subject: string) => {
      return {
        id: subject,
        title: phrases[`contentType.search.${subject}`]
      }
    }))
    return dropdowns
  }

  function bestBet(): PreparedSearchResult | undefined {
    const result: NodeQueryResponse = queryNodes('no.ssb.bestbet', 'master', {
      start: 0,
      count: 1,
      query: `fulltext('data.searchWords', '${sanitizedTerm}', 'AND')`
    } )

    const bet: BestBet | null = result.hits.length ? getNode('no.ssb.bestbet', 'master', result.hits[0].id) as BestBet : null
    let firstBet: BestBet | null
    if (bet && bet.constructor === Array) {
      firstBet = bet[0]
    } if (bet && !(bet.constructor === Array)) {
      firstBet = bet
    } else firstBet = null

    let bestBetResult: PreparedSearchResult | null
    if (firstBet && (firstBet.constructor !== Array)) {
      let date: string = firstBet.data.linkedContentDate
      let title: string = firstBet.data.linkedContentTitle ? firstBet.data.linkedContentTitle : ''
      let href: string = firstBet.data.linkedContentHref ? firstBet.data.linkedContentHref : ''
      const xpContentId: string | undefined = firstBet.data.linkedSelectedContentResult?.value
      if (firstBet.data.linkedSelectedContentResult) {
        const xpContent: Content | null = get({
          key: xpContentId
        })

        if (xpContent) {
          title = xpContent.displayName
          href = pageUrl({
            path: xpContent._path
          })
          if (firstBet.data.linkedContentDate === 'xp') {
            if (xpContent.publish && xpContent.publish.from) {
              date = xpContent.publish.from
            } else {
              date = ''
            }
          }
        }
      }

      bestBetResult = {
        title: title,
        preface: firstBet.data.linkedContentIngress ? firstBet.data.linkedContentIngress : '',
        contentType: firstBet.data.linkedContentType ? localize({
          key: `contentType.search.${firstBet.data.linkedContentType}`,
          locale: language
        }) : '',
        url: href,
        mainSubject: getSubjectForLanguage(firstBet),
        secondaryMainSubject: '',
        publishDate: firstBet.data.linkedContentDate ? firstBet.data.linkedContentDate : '',
        publishDateHuman: date ? formatDate(date, 'PPP', language) : ''
      }
      return bestBetResult
    }
    return undefined
  }

  function getSubjectForLanguage(bet: BestBet): string {
    if (language == 'en' && bet.data.linkedEnglishContentSubject) {
      return bet.data.linkedEnglishContentSubject
    } else if (bet.data.linkedContentSubject) {
      return bet.data.linkedContentSubject
    } else return ''
  }

  /* query solr */
  const solrResult: SolrPrepResultAndTotal = sanitizedTerm ?
    solrSearch( sanitizedTerm, language, parseInt(part.config.numberOfHits)) : {
      total: 0,
      hits: [],
      contentTypes: []
    }

  /* prepare props */
  const props: SearchResultProps = {
    bestBetHit: bestBet(),
    hits: solrResult.hits,
    total: solrResult.total,
    term: sanitizedTerm,
    count,
    title: content.displayName,
    nameSearchToggle: isEnabled('name-search-in-freetext-search') ? true : false,
    noHitMessage: localize({
      key: 'searchResult.noHitMessage',
      locale: language
    }),
    buttonTitle: localize({
      key: 'button.showMore',
      locale: language
    }),
    showingPhrase: localize({
      key: 'publicationArchive.showing',
      locale: language
    }),
    limitResultPhrase: localize({
      key: 'filter.limitResult',
      locale: language
    }),
    removeFilterPhrase: localize({
      key: 'filter.removeFilterSelection',
      locale: language
    }),
    searchServiceUrl: serviceUrl({
      service: 'freeTextSearch'
    }),
    nameSearchUrl: serviceUrl({
      service: 'nameSearch'
    }),
    mainSearchPhrase: localize({
      key: 'mainSearch',
      locale: language
    }),
    chooseSubjectPhrase: localize({
      key: 'dropdown.chooseSubject',
      locale: language
    }),
    chooseContentTypePhrase: localize({
      key: 'dropdown.chooseContenttype',
      locale: language
    }),
    searchText: localize({
      key: 'menuSearch',
      locale: language
    }),
    sortPhrase: localize({
      key: 'searchResult.sort.title',
      locale: language
    }),
    sortBestHitPhrase: localize({
      key: 'searchResult.sort.bestHit',
      locale: language
    }),
    sortDatePhrase: localize({
      key: 'searchResult.sort.date',
      locale: language
    }),
    namePhrases: {
      readMore: localize({
        key: 'nameSearch.readMore',
        locale: language
      }),
      nameSearchResultTitle: localize({
        key: 'nameSearch.resultTitle',
        locale: language
      }),
      thereAre: localize({
        key: 'nameSearch.thereAre',
        locale: language
      }),
      with: localize({
        key: 'nameSearch.with',
        locale: language
      }),
      have: localize({
        key: 'nameSearch.have',
        locale: language
      }),
      asTheir: localize({
        key: 'nameSearch.asTheir',
        locale: language
      }),
      threeOrLessText: localize({
        key: 'nameSearch.threeOrLessText',
        locale: language
      }),
      women: localize({
        key: 'women',
        locale: language
      }),
      men: localize({
        key: 'men',
        locale: language
      }),
      types: {
        firstgivenandfamily: localize({
          key: 'nameSearch.types.firstgivenandfamily',
          locale: language
        }),
        middleandfamily: localize({
          key: 'nameSearch.types.middleandfamily',
          locale: language
        }),
        family: localize({
          key: 'nameSearch.types.family',
          locale: language
        }),
        onlygiven: localize({
          key: 'nameSearch.types.onlygiven',
          locale: language
        }),
        onlygivenandfamily: localize({
          key: 'nameSearch.types.onlygivenandfamily',
          locale: language
        }),
        firstgiven: localize({
          key: 'nameSearch.types.firstgiven',
          locale: language
        })
      }
    },
    searchPageUrl,
    language,
    dropDownSubjects: mainSubjectDropdown,
    dropDownContentTypes: getContentTypes(solrResult.contentTypes),
    GA_TRACKING_ID: app.config && app.config.GA_TRACKING_ID ? app.config.GA_TRACKING_ID : null
  }

  return React4xp.render('site/parts/searchResult/searchResultView', props, req)
}

  interface BestBet extends RepoNode {
    data: {
      linkedSelectedContentResult: BestBetContent['linkedSelectedContentResult'];
      linkedContentTitle: BestBetContent['linkedContentTitle'];
      linkedContentHref: BestBetContent['linkedContentHref'];
      linkedContentIngress: BestBetContent['linkedContentIngress'];
      linkedContentType: BestBetContent['linkedContentType'];
      linkedContentDate: BestBetContent['linkedContentDate'];
      linkedContentSubject: BestBetContent['linkedContentSubject'];
      linkedEnglishContentSubject: BestBetContent['linkedEnglishContentSubject'];
      searchWords: BestBetContent['searchWords'];
    };
  }

interface SearchResultProps {
  bestBetHit: PreparedSearchResult | undefined;
  hits: Array<PreparedSearchResult>;
  title: string;
  total: number;
  count: number;
  term: string;
  buttonTitle: string;
  noHitMessage: string;
  showingPhrase: string;
  limitResultPhrase: string;
  removeFilterPhrase: string;
  mainSearchPhrase: string;
  chooseSubjectPhrase: string;
  chooseContentTypePhrase: string;
  searchText: string;
  sortPhrase: string;
  sortBestHitPhrase: string;
  sortDatePhrase: string;
  searchServiceUrl: string;
  nameSearchToggle: boolean;
  nameSearchUrl: string;
  namePhrases: {
    readMore: string,
    nameSearchResultTitle: string;
    thereAre: string;
    with: string;
    have: string,
    asTheir: string;
    threeOrLessText: string;
    women: string;
    men: string;
    types: {
      firstgivenandfamily: string;
      middleandfamily: string;
      family: string;
      onlygiven: string;
      onlygivenandfamily: string;
      firstgiven: string;
    };
  }
  searchPageUrl: string;
  language: string;
  dropDownSubjects: Array<Dropdown>;
  dropDownContentTypes: Array<Dropdown>;
  GA_TRACKING_ID: string | null;
}

interface Dropdown {
  id: string;
  title: string;
}

