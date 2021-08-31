import { Request, Response } from 'enonic-types/controller'
import { Component } from 'enonic-types/portal'
import { ResourceKey } from 'enonic-types/thymeleaf'
import { React4xp, React4xpObject } from '../../../lib/types/react4xp'
import { DividerPartConfig } from './divider-part-config'

const {
  getComponent
} = __non_webpack_require__('/lib/xp/portal')
const {
  render
} = __non_webpack_require__('/lib/thymeleaf')
const {
  renderError
} = __non_webpack_require__('/lib/ssb/error/error')
const {
  fromPartCache
} = __non_webpack_require__('/lib/ssb/cache/partCache')
const React4xp: React4xp = __non_webpack_require__('/lib/enonic/react4xp')

const view: ResourceKey = resolve('./divider.html')

exports.get = function(req: Request): Response {
  try {
    const component: Component<DividerPartConfig> = getComponent()
    return renderPart(req, component.config)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

exports.preview = function(req: Request): Response {
  return renderPart(req, {})
}

function renderPart(req: Request, config: DividerPartConfig): Response {
  const dividerColor: string = config.dividerColor || 'light'

  return fromPartCache(req, `divider${dividerColor}`, () => {
    const divider: React4xpObject = new React4xp('Divider')
      .setProps(
        setColor(dividerColor)
      )
      .setId('dividerId')

    const body: string = divider.renderBody({
      body: render(view, {
        dividerId: divider.react4xpId
      }),
      clientRender: false
    }).replace(/id="dividerId"/, '') // remove id since we don't need it, and don't want warnings from multiple elements with same id

    return {
      body
    }
  })
}

function setColor(dividerColor: string): object {
  if (dividerColor === 'dark') {
    return {
      dark: true
    }
  } else {
    return {
      light: true
    }
  }
}
