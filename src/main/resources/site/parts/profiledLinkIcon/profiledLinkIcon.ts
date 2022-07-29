import { ResourceKey, render } from '/lib/thymeleaf'
import { React4xp, React4xpObject } from '../../../lib/types/react4xp'
import { ProfiledLinkIconPartConfig } from './profiledLinkIcon-part-config'

const {
  data
} = __non_webpack_require__('/lib/util')
const {
  getComponent,
  pageUrl
} = __non_webpack_require__('/lib/xp/portal')

const {
  renderError
} = __non_webpack_require__('/lib/ssb/error/error')


const view: ResourceKey = resolve('./profiledLinkIcon.html')

exports.get = function(req: XP.Request): XP.Response {
  try {
    return renderPart(req)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

exports.preview = (req: XP.Request): XP.Response => renderPart(req)

const NO_LINKS_FOUND: object = {
  body: '',
  contentType: 'text/html'
}

function renderPart(req: XP.Request): XP.Response {
  const config: ProfiledLinkIconPartConfig = getComponent().config

  return renderProfiledLinks(config.profiledLinkItemSet ? data.forceArray(config.profiledLinkItemSet) : [])
}

function renderProfiledLinks(links: ProfiledLinkIconPartConfig['profiledLinkItemSet']): XP.Response {
  if (links && links.length) {
    const profiledLinkIconsXP: React4xpObject = new React4xp('Links')
      .setProps({
        links: links.map((link) => {
          return {
            children: link.text,
            href: link.href ? pageUrl({
              id: link.href
            }) : '',
            iconType: 'arrowRight',
            linkType: 'profiled'
          }
        })
      })
      .uniqueId()

    const body: string = render(view, {
      profiledLinksId: profiledLinkIconsXP.react4xpId
    })

    return {
      body: profiledLinkIconsXP.renderBody({
        body
      }),
      pageContributions: profiledLinkIconsXP.renderPageContributions() as XP.PageContributions
    }
  }
  return NO_LINKS_FOUND
}


