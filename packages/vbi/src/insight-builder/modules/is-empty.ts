import * as Y from 'yjs'

export const isEmptyVBIInsightDSL = (dsl: Y.Map<any>): boolean => {
  return (dsl.get('content') ?? '') === ''
}
