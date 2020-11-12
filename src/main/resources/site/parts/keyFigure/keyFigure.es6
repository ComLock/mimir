const React4xp = __non_webpack_require__('/lib/enonic/react4xp')
const {
  get: getKeyFigures,
  parseKeyFigure
} = __non_webpack_require__( '/lib/ssb/keyFigure')
const {
  getMunicipality
} = __non_webpack_require__( '/lib/klass/municipalities')
const {
  getContent,
  getComponent,
  getSiteConfig
} = __non_webpack_require__( '/lib/xp/portal')
const {
  render
} = __non_webpack_require__('/lib/thymeleaf')
const {
  data
} = __non_webpack_require__( '/lib/util')
const {
  renderError
} = __non_webpack_require__( '/lib/error/error')

const {
  hasRole
} = __non_webpack_require__('/lib/xp/auth')
const {
  DATASET_BRANCH,
  UNPUBLISHED_DATASET_BRANCH
} = __non_webpack_require__('/lib/repo/dataset')

const view = resolve('./keyFigure.html')

exports.get = function(req) {
  try {
    const part = getComponent()
    const keyFigureIds = data.forceArray(part.config.figure)
    const municipality = getMunicipality(req)
    return renderPart(req, municipality, keyFigureIds)
  } catch (e) {
    return renderError(req, 'Error in part', e)
  }
}

exports.preview = (req, id) => {
  const defaultMunicipality = getSiteConfig().defaultMunicipality
  const municipality = getMunicipality({
    code: defaultMunicipality
  })
  return renderPart(req, municipality, [id])
}

const renderPart = (req, municipality, keyFigureIds) => {
  const page = getContent()
  const part = getComponent()

  // get all keyFigures and filter out non-existing keyFigures
  const keyFigures = getKeyFigures(keyFigureIds)
    .map((keyFigure) => {
      const keyFigureData = parseKeyFigure(req, keyFigure, municipality, DATASET_BRANCH)
      return {
        id: keyFigure._id,
        ...keyFigureData,
        source: keyFigure.data.source
      }
    })

  const adminRole = hasRole('system.admin')

  let keyFiguresDraft
  if (adminRole && req.mode === 'preview') {
    keyFiguresDraft = getKeyFigures(keyFigureIds)
      .map((keyFigure) => {
        const keyFigureData = parseKeyFigure(req, keyFigure, municipality, UNPUBLISHED_DATASET_BRANCH)
        return {
          id: keyFigure._id,
          ...keyFigureData,
          source: keyFigure.data.source
        }
      })
  }

  const showPreviewDraft = adminRole && req.mode === 'preview'
  const draftExist = keyFiguresDraft && keyFiguresDraft.length > 0
  const pageTypeKeyFigure = page.type === `${app.name}:keyFigure`

  log.info('keyFigures: %s', JSON.stringify(keyFigures, null, 2))
  log.info('keyFiguresDraft: %s', JSON.stringify(keyFiguresDraft, null, 2))

  // continue if we have any keyFigures
  return keyFigures && keyFigures.length > 0 || draftExist ?
    renderKeyFigure(keyFigures, part, keyFiguresDraft, showPreviewDraft, req, draftExist, pageTypeKeyFigure) : {
      body: '',
      contentType: 'text/html'
    }
}

function renderKeyFigure(parsedKeyFigures, part, parsedKeyFiguresDraft, showPreviewDraft, req, draftExist, pageTypeKeyFigure) {
  const keyFigureReact = new React4xp('KeyFigure')
    .setProps({
      displayName: part ? part.config.title : undefined,
      keyFigures: parsedKeyFigures.map((keyFigure) => {
        return {
          ...keyFigure,
          glossary: keyFigure.glossaryText
        }
      }),
      keyFiguresDraft: parsedKeyFiguresDraft ? parsedKeyFiguresDraft.map((keyFigureDraft) => {
        return {
          ...keyFigureDraft,
          glossary: keyFigureDraft.glossaryText
        }
      }) : undefined,
      source: part && part.config && part.config.source || undefined,
      columns: part && part.config && part.config.columns,
      showPreviewDraft,
      paramShowDraft: req.params.showDraft,
      draftExist,
      pageTypeKeyFigure
    })
    .uniqueId()

  const body = render(view, {
    keyFiguresId: keyFigureReact.react4xpId
  })

  return {
    body: keyFigureReact.renderBody({
      body,
      clientRender: true
    }),
    pageContributions: keyFigureReact.renderPageContributions({
      clientRender: true
    }),
    contentType: 'text/html'
  }
}

