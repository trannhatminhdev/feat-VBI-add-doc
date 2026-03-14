import * as Y from 'yjs'

export function createHavingRoot(op: 'and' | 'or' = 'and'): Y.Map<any> {
  const yMap = new Y.Map<any>()
  yMap.set('op', op)
  yMap.set('conditions', new Y.Array<any>())
  return yMap
}

export function getHavingConditions(yMap: Y.Map<any>): Y.Array<any> {
  return yMap.get('conditions') as Y.Array<any>
}

export function ensureHavingRoot(dsl: Y.Map<any>): Y.Map<any> {
  const existingRoot = dsl.get('havingFilter') as Y.Map<any> | undefined
  if (existingRoot instanceof Y.Map && existingRoot.get('conditions') instanceof Y.Array) {
    return existingRoot
  }

  const root = createHavingRoot()
  const legacyHavingFilters = dsl.get('havingFilters')
  if (legacyHavingFilters instanceof Y.Array) {
    root.set('conditions', legacyHavingFilters)
    dsl.delete('havingFilters')
  }

  dsl.set('havingFilter', root)
  return root
}

export type HavingEntryMatch = {
  collection: Y.Array<any>
  index: number
  item: Y.Map<any>
}

export function isHavingGroup(yMap: Y.Map<any>): boolean {
  return yMap.get('op') !== undefined && yMap.get('conditions') !== undefined
}

export function findEntry(collection: Y.Array<any>, entryId: string): HavingEntryMatch | undefined {
  const items = collection.toArray() as Y.Map<any>[]

  for (let index = 0; index < items.length; index++) {
    const item = items[index]

    if (item.get('id') === entryId) {
      return { collection, index, item }
    }

    if (isHavingGroup(item)) {
      const nestedCollection = item.get('conditions') as Y.Array<any>
      const nestedMatch = findEntry(nestedCollection, entryId)
      if (nestedMatch) {
        return nestedMatch
      }
    }
  }

  return undefined
}
