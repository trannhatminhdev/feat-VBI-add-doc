import * as Y from 'yjs'

const getCollectionLength = (value: unknown): number => {
  if (value instanceof Y.Array) {
    return value.length
  }

  if (Array.isArray(value)) {
    return value.length
  }

  return 0
}

export const isEmptyVBIChartDSL = (dsl: Y.Map<any>): boolean => {
  const dimensionsLength = getCollectionLength(dsl.get('dimensions'))
  const measuresLength = getCollectionLength(dsl.get('measures'))
  return dimensionsLength === 0 && measuresLength === 0
}
