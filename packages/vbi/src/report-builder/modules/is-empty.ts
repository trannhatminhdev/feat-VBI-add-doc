import * as Y from 'yjs'

export const isEmptyVBIReportDSL = (dsl: Y.Map<any>): boolean => {
  const pages = dsl.get('pages')
  return !(pages instanceof Y.Array) || pages.length === 0
}
