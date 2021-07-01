import { MenuItem } from '../../../site/content-types/menuItem/menuItem'
import { Language } from '../../types/language'
import { Link } from './menu'
import { Content } from 'enonic-types/content'
import { Footer } from '../../../site/content-types/footer/footer'
const {
  assetUrl
} = __non_webpack_require__('/lib/xp/portal')
const {
  get
} = __non_webpack_require__('/lib/xp/content')
const {
  createMenuTree,
  parseGlobalLinks
} = __non_webpack_require__('/lib/ssb/parts/menu')
const {
  localize
} = __non_webpack_require__('/lib/xp/i18n')

export function getFooterContent(language: Language): FooterContent | undefined {
  if (language.footerId === undefined || language.footerId === null) {
    return undefined
  } else {
    const footerContent: Content<Footer> | null = get({
      key: language.footerId
    })

    if (!footerContent) throw new Error(`Could not get footer content with id ${language.footerId}`)

    return {
      logoUrl: assetUrl({
        path: 'SSB_logo_white.svg'
      }),
      copyrightUrl: footerContent.data.copyrightUrl,
      copyrightText: localize({
        key: 'copyrightStatisticsNorway',
        locale: language.code
      }),
      facebookUrl: footerContent.data.facebookUrl,
      twitterUrl: footerContent.data.twitterUrl,
      linkedinUrl: footerContent.data.linkedinUrl,
      rssUrl: footerContent.data.rssUrl,
      globalLinks: footerContent.data.globalLinks && footerContent.data.globalLinks.length > 0 ? parseGlobalLinks(footerContent.data.globalLinks) : [],
      footerNavigation: footerContent.data.footerContentId ? createMenuTree(footerContent.data.footerContentId) : [],
      topButtonText: localize({
        key: 'toTheTop',
        locale: language.code
      }),
      hiddenFooterText: localize({
        key: 'footerHiddenTitle',
        locale: language.code
      })
    }
  }
}

export interface FooterContent {
  logoUrl: string;
  copyrightUrl: string;
  copyrightText: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  rssUrl: string;
  globalLinks: Array<Link>;
  footerNavigation?: Array<MenuItem>;
  topButtonText?: string;
  hiddenFooterText?: string;
}

export interface FooterLib {
  getFooterContent: (language: Language) => FooterContent | undefined;
}
