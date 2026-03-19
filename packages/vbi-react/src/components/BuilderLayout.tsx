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

  return (
    <section
      className={joinClassNames('vbi-react-builder-layout', className)}
      style={{ display: 'grid', gap: 12, ...style }}
    >
      {topBar ? <header>{topBar}</header> : null}
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: columns }}>
        {leftPanel ? <aside>{leftPanel}</aside> : null}
        <main>{main}</main>
        {rightPanel ? <aside>{rightPanel}</aside> : null}
      </div>
      {footer ? <footer>{footer}</footer> : null}
    </section>
  )
}
