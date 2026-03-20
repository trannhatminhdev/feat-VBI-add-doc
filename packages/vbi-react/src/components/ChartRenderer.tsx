import type { ReactNode } from 'react'
import type { VBIBuilder } from '@visactor/vbi'
import type { VSeedDSL } from '@visactor/vseed'

import { useVSeed } from '../hooks'
import type { BaseComponentProps } from './types'
import { joinClassNames } from './utils'

export interface ChartRendererProps extends BaseComponentProps {
  builder: VBIBuilder
  debounce?: number
  emptyFallback?: ReactNode
  loadingFallback?: ReactNode
  renderError?: (error: Error, refetch: () => Promise<void>) => ReactNode
  renderVSeed?: (vseed: VSeedDSL) => ReactNode
}

export function ChartRenderer(props: ChartRendererProps) {
  const {
    builder,
    className,
    debounce,
    emptyFallback = 'No chart data yet.',
    loadingFallback = 'Loading chart…',
    renderError,
    renderVSeed,
    style,
  } = props
  const { error, loading, refetch, vseed } = useVSeed(builder, {
    debounce,
  })

  let content: ReactNode = emptyFallback

  if (error) {
    content = renderError?.(error, refetch) ?? (
      <div role="alert" style={{ display: 'grid', gap: 8 }}>
        <span>{error.message}</span>
        <button
          onClick={() => {
            void refetch()
          }}
          type="button"
        >
          Retry
        </button>
      </div>
    )
  } else if (!vseed && loading) {
    content = loadingFallback
  } else if (vseed) {
    content = renderVSeed?.(vseed) ?? (
      <pre style={{ margin: 0, overflow: 'auto', whiteSpace: 'pre-wrap' }}>{JSON.stringify(vseed, null, 2)}</pre>
    )
  }

  return (
    <section
      className={joinClassNames('vbi-react-chart-renderer', className)}
      style={{ display: 'grid', gap: 8, ...style }}
    >
      {loading && vseed ? <div aria-live="polite">Updating chart…</div> : null}
      {content}
    </section>
  )
}
