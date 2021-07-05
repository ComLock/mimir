import { Content } from 'enonic-types/content'
import { MunicipalityWithCounty } from '../dataset/klass/municipalities'

const {
  getPhrases
} = __non_webpack_require__('/lib/ssb/utils/language')
const {
  get
} = __non_webpack_require__('/lib/xp/content')
const {
  pageUrl,
  getContent
} = __non_webpack_require__('/lib/xp/portal')

function addBreadcrumbs(page: Content, visitedPage: Content, breadcrumbs: Array<Breadcrumbs> = []): Array<Breadcrumbs> {
  if (page.type === 'portal:site') {
    breadcrumbs.unshift({
      text: getPhrases(visitedPage) ? getPhrases(visitedPage).home : 'Hjem',
      link: '/'
    })
  } else {
    if (page.type !== 'base:folder') {
      breadcrumbs.unshift({
        text: page.displayName,
        link: pageUrl({
          path: page._path
        })
      })
    }
    const parent: Content | null = get({
      key: page._path.substring(0, page._path.lastIndexOf('/'))
    })

    if (parent) {
      return addBreadcrumbs(parent, visitedPage, breadcrumbs)
    }
  }
  return breadcrumbs
}

export function getBreadcrumbs(page: Content, municipality: MunicipalityWithCounty | undefined): Array<Breadcrumbs> {
  const breadcrumbs: Array<Breadcrumbs> = addBreadcrumbs(page, page)
  if (getContent().language == 'en') {
    breadcrumbs.shift()
    breadcrumbs[0].text = 'Home'
  }
  if (municipality) {
    breadcrumbs.pop()
    breadcrumbs.push({
      text: municipality.displayName
    })
  } else if (breadcrumbs.length > 0) {
    // remove link of last element in the breadcrumbs list, because its the page we're on
    delete breadcrumbs[breadcrumbs.length - 1].link
  }
  return breadcrumbs
}

interface Breadcrumbs {
    text: string;
    link?: string;
}
