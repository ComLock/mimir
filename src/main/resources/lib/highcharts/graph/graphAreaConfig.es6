const {
  mergeDeepRight
} = require('ramda')
const {
  createDefaultConfig
} = __non_webpack_require__('/lib/highcharts/graph/config')

export function areaConfig(highchartContent, options) {
  const defaultConfig = createDefaultConfig(highchartContent.data, highchartContent.displayName)
  const customConfig = {
    chart: {
      type: 'area'
    },
    yAxis: {
      labels: {
        enabled: true
      },
      categories: !highchartContent.data.switchRowsAndColumns || !options.isJsonStat ? options.categories : [highchartContent.displayName],
      stackLabels: {
        enabled: highchartContent.stacking === 'normal' && highchartContent.showStackedTotal,
        // HC sets x or y := 0 by default, leaving no breathing space between the bar and the label
        x: 0,
        y: -5
      }
    },
    xAxis: {
      categories: highchartContent.data.switchRowsAndColumns || !options.isJsonStat ? options.categories : [highchartContent.displayName]
    }
  }

  return mergeDeepRight(defaultConfig, customConfig)
}