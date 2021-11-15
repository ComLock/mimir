import { NodeQueryHit, NodeQueryResponse, RepoNode } from 'enonic-types/node'

const {
  getRepo,
  createRepo,
  repoExists
} = __non_webpack_require__('/lib/ssb/repo/repo')
const {
  nodeExists,
  createNode,
  getNode,
  getChildNodes,
  modifyNode,
  deleteNode
} = __non_webpack_require__('/lib/ssb/repo/common')
const {
  cronJobLog
} = __non_webpack_require__('/lib/ssb/utils/serverLog')

export const BESTBET_REPO: string = 'no.ssb.bestbet'
export const BESTBET_BRANCH: string = 'master'
export const UNPUBLISHED_BESTBET_BRANCH: string = 'draft'

export function setupBestBetRepo(): void {
  if (!repoExists(BESTBET_REPO, BESTBET_BRANCH)) {
    cronJobLog(`Creating Repo: '${BESTBET_REPO}' ...`)
    createRepo(BESTBET_REPO, BESTBET_BRANCH)
  } else {
    cronJobLog('BestBet Repo found.')
  }
  cronJobLog('BestBet Repo setup complete.')
}

export function listBestBets(count?: number): ReadonlyArray<RepoNode> | RepoNode | null {
  const nodes: NodeQueryResponse = getChildNodes(BESTBET_REPO, BESTBET_BRANCH, '/', count ? count : undefined, )
  const ids: Array<string> = nodes.hits.map( (hit: NodeQueryHit) => {
    return hit.id
  })
  return getNode(BESTBET_REPO, BESTBET_BRANCH, ids)
}

export function createBestBet(id: string, linkedContentId: string, searchWords: Array<string>): void {
  if (!nodeExists(BESTBET_REPO, BESTBET_BRANCH, id)) {
    createNode(BESTBET_REPO, BESTBET_BRANCH, {
      linkedContentId: linkedContentId,
      searchWords: searchWords
    })
  } else {
    modifyNode(BESTBET_REPO, BESTBET_BRANCH, id, (node) => {
      return {
        ...node,
        searchWords: searchWords
      }
    })
  }
}
