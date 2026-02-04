import { VQuery, VQueryDSL, DatasetColumn } from '@visactor/vquery'
import { useEffect, useState, useRef } from 'react'
import { VSeedRender } from '@components'
import { VSeed } from '@visactor/vseed'

interface VQueryConfig {
  datasetId: string
  schema: DatasetColumn[]
  dataset: Record<string, string | number>[]
  vquery: VQueryDSL<Record<string, string | number>>
}

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

const VQueryResultRenderBase = ({ vqueryConfig }: { vqueryConfig: VQueryConfig }) => {
  const [vseed, setVSeed] = useState<VSeed | null>(null)

  useEffect(() => {
    const run = async () => {
      const vquery = new VQuery()
      const { datasetId, schema, dataset: rawDataset, vquery: vqueryDSL } = vqueryConfig

      if (!(await vquery.hasDataset(datasetId))) {
        await vquery.createDataset(datasetId, schema as DatasetColumn[], { type: 'json', rawDataset })
      }

      const dataset = await vquery.connectDataset(datasetId)

      const queryResult = await dataset.query(vqueryDSL as VQueryDSL<Record<string, string | number>>)
      const nextVSeed = {
        chartType: 'table',
        dataset: queryResult.dataset,
      } as VSeed
      console.log('debug', nextVSeed)
      setVSeed(nextVSeed)
    }
    run()
  }, [])

  if (vseed) {
    return <VSeedRender vseed={vseed} />
  }

  return <div style={{ minHeight: 300 }}></div>
}

export const VQueryResultRender = withVisible(VQueryResultRenderBase)
