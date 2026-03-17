export interface FilterGroupInput {
  id?: string
  op?: 'and' | 'or'
  conditions?: any[]
}
