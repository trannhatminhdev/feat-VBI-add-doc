import { useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from 'react'
import { VBI, type VBIChartBuilder } from '@visactor/vbi'
import { useVBI } from '@visactor/vbi-react'
import { BuilderLayout, ChartRenderer, ChartTypeSelector, FieldPanel } from '@visactor/vbi-react/components'
import type { DatasetColumn } from '@visactor/vquery'
import type { VSeed } from '@visactor/vseed'

import { VSeedRender } from './components/Render'
import { createLocalConnector, setLocalDataWithSchema, type LocalRow } from './utils/localConnector'
import { parseCsv } from './utils/parseCsv'
import { supermarketSchema } from './utils/supermarketSchema'

type DemoStatusTone = 'error' | 'idle' | 'success'

const CONNECTOR_ID = 'vbiReactStarterLocalDataConnector'

let connectorInitialized = false

const pageStyle: CSSProperties = {
  background: '#0b0c1d',
  boxSizing: 'border-box',
  color: '#eef2ff',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  height: '100%',
  minHeight: 0,
  padding: 16,
  width: '100%',
}

const cardStyle: CSSProperties = {
  background: '#15162b',
  border: '1px solid #2a2b4d',
  borderRadius: 12,
  boxSizing: 'border-box',
}

const primaryButtonStyle: CSSProperties = {
  background: '#5b8cff',
  border: '1px solid #5b8cff',
  borderRadius: 8,
  color: '#fff',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  height: 36,
  padding: '0 14px',
}

const secondaryButtonStyle: CSSProperties = {
  ...primaryButtonStyle,
  background: 'transparent',
  color: '#dce4ff',
}

function ensureConnector() {
  if (!connectorInitialized) {
    createLocalConnector(CONNECTOR_ID)
    connectorInitialized = true
  }
}

function isLikelyDate(value: string): boolean {
  return /[-/]/.test(value) && !Number.isNaN(Date.parse(value))
}

function inferSchema(headers: string[], rows: string[][]): DatasetColumn[] {
  return headers.map((header, index) => {
    const values = rows.map((row) => row[index]?.trim() ?? '').filter((value) => value.length > 0)

    if (values.length > 0 && values.every((value) => Number.isFinite(Number(value)))) {
      return { name: header, type: 'number' }
    }

    if (values.length > 0 && values.every(isLikelyDate)) {
      return { name: header, type: 'date' }
    }

    return { name: header, type: 'string' }
  })
}

function rowsToDataset(headers: string[], rows: string[][], schema: DatasetColumn[]): LocalRow[] {
  const schemaByName = new Map(schema.map((field) => [field.name, field.type]))

  return rows
    .map((values) => {
      const row: LocalRow = {}

      headers.forEach((header, index) => {
        const rawValue = values[index]?.trim() ?? ''
        const fieldType = schemaByName.get(header)

        if (fieldType === 'number') {
          row[header] = rawValue === '' ? null : Number(rawValue)
          return
        }

        row[header] = rawValue
      })

      return row
    })
    .filter((row) => Object.values(row).some((value) => value !== '' && value !== null))
}

function clearBuilderSelections(builder: VBIChartBuilder) {
  builder.doc.transact(() => {
    builder.dimensions.toJSON().forEach((dimension: { id: string }) => {
      builder.dimensions.remove(dimension.id)
    })

    builder.measures.toJSON().forEach((measure: { id: string }) => {
      builder.measures.remove(measure.id)
    })
  })
}

function EmptyState(props: { description: string; title: string }) {
  const { description, title } = props

  return (
    <div
      style={{
        alignItems: 'center',
        color: '#c9d1ff',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        height: '100%',
        justifyContent: 'center',
        minHeight: 0,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <strong style={{ fontSize: 16 }}>{title}</strong>
      <div style={{ fontSize: 13, maxWidth: 440 }}>{description}</div>
    </div>
  )
}

export function APP() {
  ensureConnector()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [builder] = useState(() => VBI.createChart(VBI.generateEmptyChartDSL(CONNECTOR_ID)))
  const { dsl } = useVBI(builder)
  const [availableDimensions, setAvailableDimensions] = useState<string[]>([])
  const [availableMeasures, setAvailableMeasures] = useState<string[]>([])
  const [dataSourceLabel, setDataSourceLabel] = useState('未加载数据')
  const [rowCount, setRowCount] = useState(0)
  const [statusMessage, setStatusMessage] = useState('先加载 demo 数据或上传 CSV，再用 starter components 组装图表。')
  const [statusTone, setStatusTone] = useState<DemoStatusTone>('idle')

  const dimensionOptions = useMemo(
    () => availableDimensions.map((field) => ({ label: field, value: field })),
    [availableDimensions],
  )
  const measureOptions = useMemo(
    () => availableMeasures.map((field) => ({ label: field, value: field })),
    [availableMeasures],
  )

  const hasAvailableFields = availableDimensions.length > 0 || availableMeasures.length > 0
  const hasConfiguredFields = (dsl.dimensions?.length ?? 0) > 0 || (dsl.measures?.length ?? 0) > 0

  const refreshAvailableFields = async () => {
    const schema = await builder.getSchema()
    setAvailableDimensions(schema.filter((field) => field.type !== 'number').map((field) => field.name))
    setAvailableMeasures(schema.filter((field) => field.type === 'number').map((field) => field.name))
  }

  const applyDataset = async (data: LocalRow[], schema: DatasetColumn[], sourceLabel: string) => {
    setLocalDataWithSchema(data, schema)
    clearBuilderSelections(builder)
    await refreshAvailableFields()
    setDataSourceLabel(sourceLabel)
    setRowCount(data.length)
    setStatusTone('success')
    setStatusMessage(`已加载 ${data.length} 行数据。先在左侧添加维度和指标，再切换图表类型。`)
  }

  const handleLoadDemoData = async () => {
    try {
      const response = await fetch('https://visactor.github.io/VBI/dataset/supermarket.csv')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const csv = await response.text()
      const [headerRow = [], ...dataRows] = parseCsv(csv)
      const headers = headerRow.map((header) => header.trim())

      if (headers.length === 0) {
        throw new Error('Demo CSV is empty')
      }

      const data = rowsToDataset(headers, dataRows, supermarketSchema)

      await applyDataset(data, supermarketSchema, 'supermarket.csv')
    } catch (error) {
      console.error('Failed to load starter demo data:', error)
      setStatusTone('error')
      setStatusMessage('加载 demo 数据失败，请稍后重试。')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const [headerRow = [], ...dataRows] = parseCsv(text)
      const headers = headerRow.map((header) => header.trim())

      if (headers.length === 0) {
        throw new Error('CSV is empty')
      }

      const schema = inferSchema(headers, dataRows)
      const data = rowsToDataset(headers, dataRows, schema)

      await applyDataset(data, schema, file.name)
    } catch (error) {
      console.error('Failed to load uploaded CSV:', error)
      setStatusTone('error')
      setStatusMessage(`读取文件 ${file.name} 失败，请检查 CSV 格式。`)
    } finally {
      event.target.value = ''
    }
  }

  useEffect(() => {
    void refreshAvailableFields()
  }, [builder])

  return (
    <div style={pageStyle}>
      <BuilderLayout
        footer={
          <div
            style={{
              display: 'grid',
              gap: 12,
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            <section
              style={{
                ...cardStyle,
                color: '#e7ebff',
                display: 'grid',
                gap: 12,
                padding: 16,
              }}
            >
              <div>
                <strong>Starter Summary</strong>
                <div style={{ color: '#9aa4d1', fontSize: 12, marginTop: 6 }}>
                  这个 demo 只使用 `@visactor/vbi-react/components` 来搭建核心编辑区， 用来验证 hooks + slim components
                  这条路线。
                </div>
              </div>
              <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
                <div>Data source: {dataSourceLabel}</div>
                <div>Rows: {rowCount}</div>
                <div>Available dimensions: {availableDimensions.length}</div>
                <div>Available measures: {availableMeasures.length}</div>
              </div>
              <div
                style={{
                  border: '1px solid #2f335a',
                  borderRadius: 8,
                  color: statusTone === 'error' ? '#ffccc7' : statusTone === 'success' ? '#d6ffe5' : '#c9d1ff',
                  fontSize: 13,
                  padding: 12,
                }}
              >
                {statusMessage}
              </div>
              <div style={{ color: '#9aa4d1', fontSize: 12 }}>
                Demo schema 固定使用手工声明的字段类型，不再依赖首行自动猜测。
              </div>
            </section>

            <section
              style={{
                ...cardStyle,
                color: '#e7ebff',
                display: 'grid',
                gap: 8,
                padding: 16,
              }}
            >
              <strong>Current DSL Snapshot</strong>
              <pre
                style={{
                  background: '#101126',
                  borderRadius: 8,
                  color: '#b9c2ff',
                  fontSize: 12,
                  margin: 0,
                  maxHeight: 220,
                  overflow: 'auto',
                  padding: 12,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {JSON.stringify(dsl, null, 2)}
              </pre>
            </section>
          </div>
        }
        leftPanel={
          <FieldPanel
            builder={builder}
            dimensionOptions={dimensionOptions}
            measureOptions={measureOptions}
            style={{
              ...cardStyle,
              color: '#e7ebff',
              height: '100%',
              minHeight: 0,
              overflow: 'hidden',
              padding: 16,
            }}
            title="Starter Fields"
          />
        }
        leftPanelWidth={360}
        main={
          hasConfiguredFields ? (
            <ChartRenderer
              builder={builder}
              debounce={150}
              loadingFallback={<EmptyState description="正在构建图表…" title="Building chart" />}
              renderError={(error, refetch) => (
                <div
                  role="alert"
                  style={{
                    ...cardStyle,
                    color: '#ffd8d6',
                    display: 'grid',
                    gap: 12,
                    padding: 16,
                  }}
                >
                  <div>
                    <strong>Starter preview build failed</strong>
                    <div
                      style={{
                        color: '#ffb3b0',
                        fontSize: 12,
                        marginTop: 6,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {error.message}
                    </div>
                  </div>
                  <div style={{ color: '#ffccc7', fontSize: 12 }}>
                    这通常意味着字段类型、聚合配置或 DSL 组合不匹配。
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        void refetch()
                      }}
                      style={primaryButtonStyle}
                      type="button"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              renderVSeed={(vseed) => (
                <VSeedRender
                  style={{
                    background: '#fff',
                    borderRadius: 8,
                    minHeight: 0,
                    overflow: 'hidden',
                    padding: 8,
                  }}
                  vseed={vseed as VSeed}
                />
              )}
              style={{
                ...cardStyle,
                background: '#202244',
                height: '100%',
                minHeight: 0,
                minWidth: 0,
                overflow: 'hidden',
                padding: 12,
              }}
            />
          ) : hasAvailableFields ? (
            <div style={{ ...cardStyle, background: '#202244', height: '100%' }}>
              <EmptyState
                description="数据已经准备好。先在左侧添加维度和指标，再让 starter components 自动出图。"
                title="Choose fields to start"
              />
            </div>
          ) : (
            <div style={{ ...cardStyle, background: '#202244', height: '100%' }}>
              <EmptyState
                description="点击上方的 Load demo data，或上传一个 CSV 文件，左侧字段面板就会立即可用。"
                title="No data loaded yet"
              />
            </div>
          )
        }
        style={{
          height: '100%',
          minHeight: '100%',
        }}
        topBar={
          <div
            style={{
              ...cardStyle,
              alignItems: 'center',
              color: '#e7ebff',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'space-between',
              padding: 16,
            }}
          >
            <div style={{ display: 'grid', gap: 6 }}>
              <strong>vbi-react Starter</strong>
              <div style={{ color: '#9aa4d1', fontSize: 12, maxWidth: 560 }}>
                `FieldPanel`、`ChartTypeSelector`、`ChartRenderer` 和 `BuilderLayout`
                直接拼出一个可用的低门槛搭建器；需要深度自定义时，再下钻到 hooks。
              </div>
            </div>

            <div
              style={{
                alignItems: 'end',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <ChartTypeSelector builder={builder} style={{ color: '#e7ebff', minWidth: 180 }} />
              <button
                onClick={() => {
                  void handleLoadDemoData()
                }}
                style={primaryButtonStyle}
                type="button"
              >
                Load demo data
              </button>
              <button onClick={handleUploadClick} style={secondaryButtonStyle} type="button">
                Upload CSV
              </button>
            </div>
          </div>
        }
      />

      <input accept=".csv,text/csv" hidden onChange={handleFileChange} ref={fileInputRef} type="file" />
    </div>
  )
}

export default APP
