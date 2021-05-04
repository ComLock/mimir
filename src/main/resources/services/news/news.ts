import { Response } from 'enonic-types/controller'
import { Content, ContentLibrary } from 'enonic-types/content'
import { Page } from '../../site/content-types/page/page'
import { DefaultPageConfig } from '../../site/pages/default/default-page-config'
import { Article } from '../../site/content-types/article/article'
import { StatRegStatisticsLib } from '../../lib/ssb/statreg/statistics'
import moment = require('moment')
import { StatisticInListing } from '../../lib/ssb/dashboard/statreg/types'
import { Statistics } from '../../site/content-types/statistics/statistics'
import { PortalLibrary } from 'enonic-types/portal'
const {
  query
}: ContentLibrary = __non_webpack_require__('/lib/xp/content')
const {
  fetchStatisticsWithPreviousReleaseBetween
}: StatRegStatisticsLib = __non_webpack_require__('/lib/ssb/statreg/statistics')
const {
  pageUrl
}: PortalLibrary = __non_webpack_require__('/lib/xp/portal')
const {
  isEnabled
} = __non_webpack_require__('/lib/featureToggle')

function get(): Response {
  const rssNewsEnabled: boolean = isEnabled('rss-news', true)
  const rssStatisticsEnabled: boolean = isEnabled('rss-news-statistics', false)
  const mainSubjects: Array<Content<Page, DefaultPageConfig>> = rssNewsEnabled ? query({
    start: 0,
    count: 100,
    query: 'components.page.config.mimir.default.subjectType LIKE "mainSubject"'
  }).hits as unknown as Array<Content<Page, DefaultPageConfig>> : []

  const news: Array<News> = rssNewsEnabled ? getNews(mainSubjects) : []
  const statistics: Array<News> = rssNewsEnabled && rssStatisticsEnabled ? getStatisticsNews(mainSubjects) : []
  const xml: string =
  `<?xml version="1.0" encoding="utf-8"?>
  <rssitems count="${news.length + statistics.length}">
    ${[...news, ...statistics].map((n: News) =>`<rssitem>
      <guid isPermalink="false">${n.guid}</guid>
      <title>${n.title}</title>
      <link>${n.link}</link>
      <description>${n.description}</description>
      <category>${n.category}</category>
      <subject>${n.subject}</subject>
      <language>${n.language}</language>
      <pubDate>${n.pubDate}</pubDate>
      <shortname>${n.shortname}</shortname>
    </rssitem>`).join('')}
  </rssitems>`
  return {
    body: xml,
    contentType: 'text/xml'
  }
}
exports.get = get

function getNews(mainSubjects: Array<Content<Page, DefaultPageConfig>>): Array<News> {
  const from: string = moment().subtract(1, 'days').toISOString()
  const to: string = moment().toISOString()
  const baseUrl: string = app.config && app.config['ssb.baseUrl'] || ''
  const serverOffsetInMinutes: number = app.config && app.config['serverOffsetInMs'] || 0

  const news: Array<News> = []
  mainSubjects.forEach((mainSubject) => {
    const articles: Array<Content<Article, object, SEO>> = query({
      start: 0,
      count: 1000,
      contentTypes: [`${app.name}:article`],
      query: `_path LIKE "/content${mainSubject._path}/*" AND range("publish.first", instant("${from}"), instant("${to}"))`
    }).hits as unknown as Array<Content<Article, object, SEO>>
    articles.forEach((article) => {
      const pubDate: string | undefined = article.publish?.first ?
        moment(article.publish?.first).utcOffset(serverOffsetInMinutes / 1000 / 60).format() :
        undefined
      if (pubDate) {
        news.push({
          guid: article._id,
          title: article.displayName,
          link: baseUrl + pageUrl({
            id: article._id
          }),
          description: article.data.ingress || article.x['com-enonic-app-metafields']['meta-data'].seoDescription || '',
          category: mainSubject.displayName,
          subject: mainSubject._name,
          language: article.language === 'en' ? 'en' : 'no',
          pubDate: pubDate,
          shortname: ''
        })
      }
    })
  })

  return news
}

function getStatisticsNews(mainSubjects: Array<Content<Page, DefaultPageConfig>>): Array<News> {
  const from: string = moment().subtract(1, 'days').toISOString()
  const to: string = moment().toISOString()
  const statregStatistics: Array<StatisticInListing> = fetchStatisticsWithPreviousReleaseBetween(new Date(from), new Date(to))

  const statisticsNews: Array<News> = []
  if (statregStatistics.length > 0) {
    mainSubjects.forEach((mainSubject) => {
      const statistics: Array<Content<Statistics, object, SEO>> = query({
        start: 0,
        count: 100,
        query: `_path LIKE "/content${mainSubject._path}/*" AND data.statistic IN(${statregStatistics.map((s) => `"${s.id}"`).join(',')})`
      }).hits as unknown as Array<Content<Statistics, object, SEO>>

      const baseUrl: string = app.config && app.config['ssb.baseUrl'] || ''
      const serverOffsetInMS: number = app.config && app.config['serverOffsetInMs'] || 0
      statistics.forEach((statistic) => {
        const statreg: StatisticInListing | undefined = statregStatistics.find((s) => s.id.toString() === statistic.data.statistic)
        const pubDate: string | undefined = statistic.publish?.first ?
          moment(statreg?.variants[0].previousRelease).utcOffset(serverOffsetInMS / 1000 / 60, true).format() :
          undefined
        if (pubDate) {
          statisticsNews.push({
            guid: statistic._id,
            title: statistic.displayName, // displayName, frequency
            link: baseUrl + pageUrl({
              id: statistic._id
            }),
            description: statistic.x['com-enonic-app-metafields']['meta-data'].seoDescription || '',
            category: mainSubject.displayName,
            subject: mainSubject._name,
            language: statistic.language === 'en' ? 'en' : 'no',
            pubDate: pubDate,
            shortname: statreg ? statreg.shortName : ''
          })
        }
      })
    })
  }

  return statisticsNews
}

interface SEO {
  seoDescription?: string;
}

interface News {
  guid: string; // _id
  title: string; // displayName
  link: string; // url
  description: string; // ingress
  category: string; // parent displayName
  subject: string; // parent _name
  language: string; // language
  pubDate: string; // firstPublished
  shortname: string; // statreg shortname
}
