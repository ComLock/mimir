import { cronContext } from '../../lib/ssb/cron/cron'
import { CleanupPublishDatasetConfig } from '../cleanupPublishDataset/cleanupPublishDataset-config'
import { PublishDatasetConfig } from './publishDataset-config'
__non_webpack_require__('/lib/ssb/polyfills/nashorn')

const {
  extractKey
} = __non_webpack_require__('/lib/ssb/dataset/dataset')
const {
  createOrUpdateDataset,
  DATASET_BRANCH
} = __non_webpack_require__('/lib/ssb/repo/dataset')
const {
  send
} = __non_webpack_require__('/lib/xp/event')
const {
  progress,
  sleep
} = __non_webpack_require__('/lib/xp/task')
const {
  create: createScheduledJob
} = __non_webpack_require__('/lib/xp/scheduler')
const {
  run
} = __non_webpack_require__('/lib/xp/context')

exports.run = function(props: PublishDatasetConfig): void {
  const {
    jobId,
    statisticsContentId,
    publicationItem,
    statisticsId,
    datasetIndex
  } = props
  const {
    dataSource,
    dataset
  } = JSON.parse(publicationItem)
  if (dataset && dataSource.data.dataSource) {
    progress({
      info: `${statisticsId}`
    })
    sleep(1000)

    const key: string | null = extractKey(dataSource)
    const sleepFor: number = Number(datasetIndex) * 1000
    const dateWithSleep: string = new Date(new Date().getTime() + sleepFor).toISOString()

    if (key) {
      // log.info(`start publishing dataset: ${dataSource.data.dataSource?._selected} Key: ${key} for Statistikk ${statisticsId}`)
      createOrUpdateDataset(dataSource.data.dataSource?._selected, DATASET_BRANCH, key, dataset.data)
      // log.info(`finished publish of dataset: ${dataSource.data.dataSource?._selected} Key: ${key} for Statistikk ${statisticsId}`)

      send({
        type: 'clearDatasetCache',
        distributed: true,
        data: {
          path: dataset._path
        }
      })
    }

    run(cronContext, () => {
      log.info(`create task: cleanupPublishDataset_${jobId}_${statisticsId}_${dataset._name} Time: ${dateWithSleep}` )
      createScheduledJob<CleanupPublishDatasetConfig>({
        name: `cleanupPublishDataset_${jobId}_${statisticsId}_${dataset._name}`,
        descriptor: 'mimir:cleanupPublishDataset',
        enabled: true,
        schedule: {
          type: 'ONE_TIME',
          value: dateWithSleep
        },
        config: {
          jobId: jobId,
          statisticsContentId: statisticsContentId,
          statisticsId: statisticsId,
          publicationItem: publicationItem
        }
      })
    })
  }
}