import type { ReactNode } from 'react'

import type { BaseComponentProps } from './types'
import { joinClassNames } from './utils'

export interface BuilderLayoutProps extends BaseComponentProps {
  footer?: ReactNode
  leftPanel?: ReactNode
  leftPanelWidth?: number | string
  main?: ReactNode
  rightPanel?: ReactNode
  rightPanelWidth?: number | string
  topBar?: ReactNode
}

function toTrackSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

export function BuilderLayout(props: BuilderLayoutProps) {
  const {
    className,
    footer,
    leftPanel,
    leftPanelWidth = 320,
    main,
    rightPanel,
    rightPanelWidth = 320,
    style,
    topBar,
  } = props

  const columns = [
    leftPanel ? toTrackSize(leftPanelWidth) : undefined,
    'minmax(0, 1fr)',
    rightPanel ? toTrackSize(rightPanelWidth) : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const rows = [topBar ? 'auto' : undefined, 'minmax(0, 1fr)', footer ? 'auto' : undefined].filter(Boolean).join(' ')

  return (
    <section
      className={joinClassNames('vbi-react-builder-layout', className)}
      style={{ display: 'grid', gap: 12, gridTemplateRows: rows, minHeight: 0, minWidth: 0, ...style }}
    >
      {topBar ? <header>{topBar}</header> : null}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: columns, minHeight: 0, minWidth: 0 }}>
        {leftPanel ? <aside style={{ minHeight: 0, minWidth: 0 }}>{leftPanel}</aside> : null}
        <main style={{ minHeight: 0, minWidth: 0 }}>{main}</main>
        {rightPanel ? <aside style={{ minHeight: 0, minWidth: 0 }}>{rightPanel}</aside> : null}
      </div>
      {footer ? <footer style={{ minHeight: 0, minWidth: 0 }}>{footer}</footer> : null}
    </section>
  )
}
