import { InMemoryAdapter } from './adapters'
import { DuckDBNodeQueryAdapter } from './adapters/query-adapter/duckdbNodeAdapter'
import { VQuery as VQueryCore } from './VQuery'

export class VQuery extends VQueryCore {
  constructor() {
    super(new DuckDBNodeQueryAdapter(), new InMemoryAdapter())
  }
}
