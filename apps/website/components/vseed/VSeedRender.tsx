import { useRef, useEffect, useState } from 'react'
import { useDark } from '@rspress/core/runtime'
import VChart, { ISpec } from '@visactor/vchart'
import {
  ListTable,
  PivotTable,
  PivotChart,
  register,
  ListTableConstructorOptions,
  PivotTableConstructorOptions,
  PivotChartConstructorOptions,
} from '@visactor/vtable'
import {
  registerAll,
  VSeed,
  Builder,
  isPivotChart,
  isVChart,
  isPivotTable,
  isTable,
  ColorIdEncoding,
  DATUM_HIDE_KEY,
} from '@visactor/vseed'

declare global {
  interface Window {
    pivotChart?: PivotChart
    vchart?: VChart
    table?: ListTable | PivotTable
  }
}

registerAll()
register.chartModule('vchart', VChart)

const withVisible = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => {
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        },
        { threshold: 0.1 },
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => observer.disconnect()
    }, [])

    return (
      <div ref={ref} style={{ minHeight: 1 }}>
        {visible ? <WrappedComponent {...props} /> : <div style={{ minHeight: 300 }}></div>}
      </div>
    )
  }
}

export const VSeedRender = withVisible((props: { vseed: VSeed }) => {
  const { vseed } = props
  const ref = useRef<HTMLDivElement>(null)
  const builderRef = useRef<Builder>(null)
  const dark = useDark()
  const selectedDimValueRef = useRef<string[]>([])
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const theme = dark ? 'dark' : 'light'
    const builder = Builder.from(vseed.theme ? vseed : { ...vseed, theme })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let spec = builder.build() as Record<string, any>
    spec = {
      ...spec,
      chartDimensionLinkage: {
        ...spec.chartDimensionLinkage,
        clearChartState: () => {
          console.log('!!ClearChartState')
          selectedDimValueRef.current = []
          if (window.pivotChart) {
            window.pivotChart.enableTooltipToAllChartInstances()
          }
        },
        inBrushStateFilter: (datum: Record<string, unknown>) => {
          console.log('inBrushState', datum, selectedDimValueRef.current)
          return selectedDimValueRef.current.length
            ? selectedDimValueRef.current.includes(datum['__Dim_X__'] as string)
            : true
        },
        outOfBrushStateFilter: (datum: Record<string, unknown>) => {
          return selectedDimValueRef.current.length
            ? !selectedDimValueRef.current.includes(datum['__Dim_X__'] as string)
            : false
        },
        listenBrushChange: true,
        brushChangeDelay: 100,
      },
    }

    builderRef.current = builder
    if (isPivotChart(vseed)) {
      const tableInstance = new PivotChart(ref.current, spec as PivotChartConstructorOptions)

      tableInstance.on('legend_item_click', (args) => {
        console.log('LEGEND_ITEM_CLICK', args)
        tableInstance.updateFilterRules([
          {
            filterKey: ColorIdEncoding,
            filteredValues: args.value,
          },
        ])
      })
      tableInstance.onVChartEvent('brushEnd', (args) => {
        console.log('brushEnd', args)
        selectedDimValueRef.current = args.value.inBrushData.map(
          (dataItem: Record<string, unknown>) => dataItem['__Dim_X__'] as string,
        )
      })
      tableInstance.onVChartEvent('brushStart', () => {
        if (window.pivotChart) {
          window.pivotChart.enableTooltipToAllChartInstances()
        }
      })
      tableInstance.onVChartEvent('brushChange', (args) => {
        console.log('brushChange', args)
        selectedDimValueRef.current = args.value.inBrushData.map(
          (dataItem: Record<string, unknown>) => dataItem['__Dim_X__'] as string,
        )
      })

      tableInstance.on('legend_change', (args) => {
        const maxValue = args.value[1]
        const minValue = args.value[0]

        if (vseed.chartType === 'heatmap') {
          tableInstance.updateFilterRules([
            {
              filterFunc: (record) => {
                const value = record[record[ColorIdEncoding]]
                const isShow = value >= minValue && value <= maxValue

                record[DATUM_HIDE_KEY] = !isShow

                return true
              },
            },
          ])
        } else {
          tableInstance.updateFilterRules([
            {
              filterFunc: (record) => {
                const value = record[record[ColorIdEncoding]]
                if (value >= minValue && value <= maxValue) {
                  return true
                }
                return false
              },
            },
          ])
        }
      })
      window.pivotChart = tableInstance
      return () => tableInstance.release()
    } else if (isVChart(vseed)) {
      const vchart = new VChart(spec as ISpec, { dom: ref.current })
      vchart.renderSync()

      vchart.on('brushEnd', (e) => {
        console.log(e)
      })

      window.vchart = vchart
      return () => vchart.release()
    } else if (isTable(vseed)) {
      const tableInstance = new ListTable(ref.current, spec as ListTableConstructorOptions)
      window.table = tableInstance
      return () => tableInstance.release()
    } else if (isPivotTable(vseed)) {
      const tableInstance = new PivotTable(ref.current, spec as PivotTableConstructorOptions)

      window.table = tableInstance
      return () => tableInstance.release()
    }
  }, [vseed, dark])

  return (
    <div
      ref={ref}
      style={{ height: 300, width: '100%' }}
      onClick={() => {
        console.group(`selected ${vseed.chartType}`)
        console.log('builder', builderRef?.current)
        console.log('spec', builderRef?.current?.spec)
        console.log('vseed', builderRef?.current?.vseed)
        console.log('advancedVSeed', builderRef?.current?.advancedVSeed)
        console.log('chartInstance', window.table || window.pivotChart || window.vchart)
        console.groupEnd()
      }}
    >
      {' '}
    </div>
  )
})
