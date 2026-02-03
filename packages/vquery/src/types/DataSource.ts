export type TidyDatum = Record<string, number | string | null | boolean | undefined>

export type DatasetSourceType = 'csv' | 'json' | 'parquet'

export type DatasetSourceValue = string | ArrayBuffer | Blob | TidyDatum[]

export interface DatasetSource {
  type: DatasetSourceType
  blob: Blob
}

export interface RawDatasetSource {
  type: DatasetSourceType
  rawDataset: DatasetSourceValue
}
