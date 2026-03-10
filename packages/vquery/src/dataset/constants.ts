import { DatasetSourceType, DataType } from 'src/types'

export const READ_FUNCTION_MAP: Record<DatasetSourceType, string> = {
  csv: 'read_csv_auto',
  json: 'read_json_auto',
  parquet: 'read_parquet',
}

export const DATA_TYPE_MAP: Record<DataType, string> = {
  number: 'DOUBLE',
  string: 'VARCHAR',
  date: 'DATE',
  datetime: 'TIMESTAMP',
  timestamp: 'TIMESTAMP',
}

export const buildColumnsStruct = (columns: { name: string; type: DataType }[]): string => {
  const columnDefs = columns.map((c) => {
    const duckDBType = DATA_TYPE_MAP[c.type] || 'VARCHAR'
    return `'${c.name}': '${duckDBType}'`
  })
  return `{${columnDefs.join(', ')}}`
}
