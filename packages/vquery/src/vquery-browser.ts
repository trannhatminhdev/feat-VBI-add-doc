import { IndexedDBAdapter } from './adapters'
import { DuckDBWebQueryAdapter } from './adapters/query-adapter/duckdbWebAdapter'
import { VQuery as VQueryCore } from './VQuery'

export class VQuery extends VQueryCore {
  constructor() {
    super(new DuckDBWebQueryAdapter(), new IndexedDBAdapter())
  }
}
