import * as Y from 'yjs'
import type { VBIFilter, ObserveCallback } from 'src/types'

export class FiltersBuilder {
  private dsl: Y.Map<any>
  private doc: Y.Doc

  constructor(doc: Y.Doc, dsl: Y.Map<any>) {
    this.doc = doc
    this.dsl = dsl
    
    // Ensure filters array exists in Y.Map
    if (!this.dsl.get('filters')) {
      this.doc.transact(() => {
        this.dsl.set('filters', new Y.Array<any>())
      })
    }
  }

  addFilter(filter: VBIFilter) {
    const yMap = new Y.Map<any>()
    if (filter.enabled === undefined) filter.enabled = true
    if (!filter.id) filter.id = Date.now().toString()
    for (const [key, value] of Object.entries(filter)) {
      yMap.set(key, value)
    }
    this.dsl.get('filters').push([yMap])
    return this
  }

  updateFilter(index: number, filter: Partial<VBIFilter>) {
    const filters = this.dsl.get('filters')
    if (index >= 0 && index < filters.length) {
      const oldFilter = filters.get(index)
      const updated = { ...oldFilter.toJSON(), ...filter }
      const yMap = new Y.Map<any>()
      for (const [key, value] of Object.entries(updated)) {
        yMap.set(key, value)
      }
      filters.delete(index, 1)
      filters.insert(index, [yMap])
    }
    return this
  }

  removeFilter(index: number) {
    const filters = this.dsl.get('filters')
    if (index >= 0 && index < filters.length) {
      filters.delete(index, 1)
    }
    return this
  }

  clearFilters() {
    const filters = this.dsl.get('filters')
    filters.delete(0, filters.length)
    return this
  }

  getFilters(): VBIFilter[] {
    return this.dsl.get('filters').toJSON()
  }

  observe(callback: ObserveCallback) {
    this.dsl.get('filters').observe(callback)
  }

  unobserve(callback: ObserveCallback) {
    this.dsl.get('filters').unobserve(callback)
  }
}
