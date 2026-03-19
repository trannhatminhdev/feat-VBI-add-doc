import type { CSSProperties, ReactNode } from 'react'

export interface SelectOption<Value extends string = string> {
  label?: ReactNode
  value: Value
}

export interface BaseComponentProps {
  className?: string
  style?: CSSProperties
}
