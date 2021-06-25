import { HttpResponse } from 'enonic-types/http'

const SOLR_PARAM_QUERY: string = 'q'
const SOLR_FORMAT: string = 'json'
const SOLR_BASE_URL: string = app.config && app.config['ssb.solrFriTekstSok.baseUrl'] ? app.config['ssb.solrFriTekstSok.baseUrl'] :
  'https://i.ssb.no/solrmaster/fritekstsok/select'


const {
  request
} = __non_webpack_require__('/lib/http-client')

const {
  moment
} = __non_webpack_require__('/lib/vendor/moment')


export function solrSearch(term: string, language: string, numberOfHits: number, start: number = 0): SolrPrepResultAndTotal {
  const searchResult: SolrResult | undefined = querySolr({
    query: createQuery(term, language, numberOfHits, start)
  })
  return searchResult ? {
    hits: nerfSearchResult(searchResult, language),
    total: searchResult.grouped.gruppering.matches
  } : {
    hits: [],
    total: 0
  }
}


function nerfSearchResult(solrResult: SolrResult, language: string): Array<PreparedSearchResult> {
  return solrResult.grouped.gruppering.groups.reduce((acc: Array<PreparedSearchResult>, group) => {
    group.doclist.docs.forEach((doc: SolrDoc) => {
      const highlight: SolrHighlighting | undefined = solrResult.highlighting[doc.id]
      acc.push({
        title: highlight.tittel ? highlight.tittel[0] : doc.tittel,
        preface: highlight.innhold ? highlight.innhold[0] : doc.tittel,
        contentType: doc.innholdstype,
        url: doc.url,
        mainSubject: doc.hovedemner.split(';')[0],
        publishDate: doc.publiseringsdato,
        publishDateHuman: doc.publiseringsdato ? moment(doc.publiseringsdato).locale(language).format('Do MMMM YYYY') : ''
      })
    })
    return acc
  }, [])
}


function querySolr(queryParams: SolrQueryParams): SolrResult | undefined {
  const solrResponse: SolrResponse = requestSolr(queryParams)
  if (solrResponse.status === 200) {
    return JSON.parse(solrResponse.body)
  } else {
    return undefined
  }
}


function requestSolr(queryParams: SolrQueryParams): {body: object; status: number} {
  try {
    const result: HttpResponse = request({
      url: queryParams.query
    })
    return {
      status: result.status,
      body: result.body
    }
  } catch (e) {
    log.error('Could not request solr with parameters: ')
    log.error(JSON.stringify(queryParams, null, 2))
    log.error(JSON.stringify(e, null, 2))
    return {
      status: e.status ? e.status : 500,
      body: e.body ? e.body : {
        message: 'Internal error trying to request solr'
      }
    }
  }
}


function createQuery(term: string, language: string, numberOfHits: number, start: number): string {
  return `${SOLR_BASE_URL}?${SOLR_PARAM_QUERY}=${term}&wt=${SOLR_FORMAT}&start=${start}&rows=${numberOfHits}`
}


/*
* Interfaces
*/
export interface SolrUtilsLib {
    solrSearch: (term: string, language: string, numberOfHits: number, start?: number) => SolrPrepResultAndTotal;
}

interface SolrQueryParams {
  query: string;
}

interface SolrResponse {
  status: number;
  body: string;
}

export interface PreparedSearchResult {
  title: string;
  preface: string;
  contentType: string;
  url: string;
  mainSubject: string;
  publishDate: string;
  publishDateHuman: string;
}

export interface SolrPrepResultAndTotal {
  total: number;
  hits: Array<PreparedSearchResult>;
}

interface SolrResult {
  responseHeader: {
    status: number;
    QTime: number;
    params: {
      q: string;
    };
  };
  grouped: {
    gruppering: {
      matches: number;
      ngroups: number;
      groups: Array<SolrGroup>;
    };
  };
  // eslint-disable-next-line camelcase
  facet_counts: {
    // eslint-disable-next-line camelcase
    facet_queries: {
      uke: number;
      maned: number;
      ar: number;
      '5ar': number;
      udatert: number;
    };
    // eslint-disable-next-line camelcase
    facet_fields: {
      innholdstype: Array<string | number>;
    };
  };
  highlighting: {
    [key: string]: SolrHighlighting;
  };
}

interface SolrHighlighting {
  tittel: Array<string>;
  innhold: Array<string>;
}

interface SolrGroup {
  doclist: DocList;
  kating: Array<DocList>;
  groupValue: number;
}

interface DocList {
  docs: Array<SolrDoc>;
  numFound: number;
  start: number;
}

interface SolrDoc {
  url: string;
  id: string;
  tittel: string;
  innholdstype: string;
  publiseringsdato: string;
  'om-statistikken': string;
  undertittel: string;
  hovedemner: string;
  sprak: string;
  rom: string;
}
