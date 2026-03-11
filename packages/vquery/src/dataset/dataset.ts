import { DatasetColumn, DatasetSource, QueryDSL, VQueryDSL } from 'src/types'
import { QueryAdapter, StorageAdapter } from 'src/types'
import { convertDSLToSQL } from 'src/sql-builder'
import { READ_FUNCTION_MAP, buildColumnsStruct } from './constants'

export class Dataset {
  private queryAdapter: QueryAdapter
  private storageAdapter: StorageAdapter
  private _datasetId: string

  constructor(queryAdapter: QueryAdapter, storageAdapter: StorageAdapter, datasetId: string) {
    this.queryAdapter = queryAdapter
    this.storageAdapter = storageAdapter
    this._datasetId = datasetId
  }

  public async init(temporaryColumns?: DatasetColumn[], temporaryDatasetSource?: DatasetSource) {
    const datasetInfo = await this.storageAdapter.readDataset(this._datasetId)
    if (!datasetInfo) {
      throw new Error(`Dataset ${this._datasetId} not found`)
    }

    const columns = temporaryColumns ?? datasetInfo.datasetSchema.columns
    const datasetSource = temporaryDatasetSource ?? datasetInfo.datasetSource

    if (columns.length > 0 && datasetSource) {
      await this.createOrReplaceView(columns, datasetSource)
    }
  }

  public async createOrReplaceView(columns: DatasetColumn[], datasetSource: DatasetSource) {
    if (!datasetSource) {
      return
    }

    const readFunction = READ_FUNCTION_MAP[datasetSource.type]
    if (!readFunction) {
      throw new Error(`Unsupported dataSource type: ${datasetSource.type}`)
    }

    await this.queryAdapter.writeFile(this._datasetId, datasetSource.blob)

    const columnsStruct = buildColumnsStruct(columns)
    const columnNames = columns.map((c) => `"${c.name}"`).join(', ')

    let readSql = `${readFunction}('${this._datasetId}')`
    if (datasetSource.type === 'csv' || datasetSource.type === 'json') {
      readSql = `${readFunction}('${this._datasetId}', columns=${columnsStruct})`
    }

    const createViewSql = `CREATE OR REPLACE VIEW "${this._datasetId}" AS SELECT ${columnNames} FROM ${readSql}`
    await this.queryAdapter.query(createViewSql)
  }

  public async query<T extends Record<string, number | string>>(queryDSL: QueryDSL<T> | VQueryDSL<T>) {
    const sql = convertDSLToSQL(queryDSL, this.datasetId)
    return this.queryBySQL(sql)
  }

  public async queryBySQL(sql: string) {
    const start = performance?.now?.() ?? Date.now()
    const result = await this.queryAdapter.query(sql)
    const end = performance?.now?.() ?? Date.now()

    return {
      ...result,
      performance: {
        startAt: start.toFixed(3),
        endAt: end.toFixed(3),
        duration: end - start,
      },
    }
  }

  public async disconnect() {
    await this.queryAdapter.query(`DROP VIEW IF EXISTS "${this._datasetId}"`)
  }

  get datasetId() {
    return this._datasetId
  }
}
