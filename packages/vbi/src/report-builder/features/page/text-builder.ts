import * as Y from 'yjs'
import type { VBIReportTextDSL } from 'src/types'

export class ReportTextBuilder {
  constructor(private yMap: Y.Map<any>) {}

  getContent(): string {
    return this.yMap.get('content') ?? ''
  }

  setContent(content: string): this {
    this.yMap.set('content', content)
    return this
  }

  clear(): this {
    this.yMap.set('content', '')
    return this
  }

  toJSON(): VBIReportTextDSL {
    return this.yMap.toJSON() as VBIReportTextDSL
  }
}
