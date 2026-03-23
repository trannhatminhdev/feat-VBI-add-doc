import { useEffect, useMemo, useState } from 'react'
import type { VBIChartBuilder, VBIMeasure } from '@visactor/vbi'

import { useDimensions, useMeasures } from '../hooks'
import type { BaseComponentProps, SelectOption } from './types'
import { joinClassNames } from './utils'

type MeasureAggregateFunction = NonNullable<NonNullable<VBIMeasure['aggregate']>['func']>

const defaultMeasureAggregateOptions: Array<SelectOption<MeasureAggregateFunction>> = [
  { label: 'Sum', value: 'sum' },
  { label: 'Average', value: 'avg' },
  { label: 'Count', value: 'count' },
  { label: 'Max', value: 'max' },
  { label: 'Min', value: 'min' },
]

const defaultMeasureEncodingOptions: Array<SelectOption<NonNullable<VBIMeasure['encoding']>>> = [
  { label: 'Y Axis', value: 'yAxis' },
  { label: 'X Axis', value: 'xAxis' },
  { label: 'Color', value: 'color' },
  { label: 'Label', value: 'label' },
  { label: 'Tooltip', value: 'tooltip' },
  { label: 'Size', value: 'size' },
]

const sectionTitleStyle = {
  fontSize: 12,
  lineHeight: 1.4,
}

const controlStyle = {
  border: '1px solid #c7cad1',
  borderRadius: 6,
  fontSize: 12,
  height: 28,
  minWidth: 0,
  padding: '0 8px',
}

const actionButtonStyle = {
  ...controlStyle,
  background: '#f5f6f8',
  cursor: 'pointer',
  flexShrink: 0,
  padding: '0 10px',
  whiteSpace: 'nowrap' as const,
}

const fieldCardStyle = {
  border: '1px solid #d9d9d9',
  borderRadius: 8,
  display: 'grid',
  gap: 6,
  padding: 8,
}

export interface FieldPanelProps extends BaseComponentProps {
  builder: VBIChartBuilder
  dimensionOptions?: Array<SelectOption<string>>
  dimensionsTitle?: string
  measureAggregateOptions?: Array<SelectOption<MeasureAggregateFunction>>
  measureEncodingOptions?: Array<SelectOption<NonNullable<VBIMeasure['encoding']>>>
  measureOptions?: Array<SelectOption<string>>
  measuresTitle?: string
  title?: string
}

export function FieldPanel(props: FieldPanelProps) {
  const {
    builder,
    className,
    dimensionOptions = [],
    dimensionsTitle = 'Dimensions',
    measureAggregateOptions = defaultMeasureAggregateOptions,
    measureEncodingOptions = defaultMeasureEncodingOptions,
    measureOptions = [],
    measuresTitle = 'Measures',
    style,
    title = 'Fields',
  } = props
  const { addDimension, dimensions, removeDimension, updateDimension } = useDimensions(builder)
  const { addMeasure, measures, removeMeasure, updateMeasure } = useMeasures(builder)
  const [selectedDimension, setSelectedDimension] = useState('')
  const [selectedMeasure, setSelectedMeasure] = useState('')

  const availableDimensionOptions = useMemo(() => {
    const activeFields = new Set(dimensions.map((dimension) => dimension.field))
    return dimensionOptions.filter((dimensionOption) => !activeFields.has(dimensionOption.value))
  }, [dimensionOptions, dimensions])

  const availableMeasureOptions = useMemo(() => {
    const activeFields = new Set(measures.map((measure) => measure.field))
    return measureOptions.filter((measureOption) => !activeFields.has(measureOption.value))
  }, [measureOptions, measures])

  useEffect(() => {
    if (!availableDimensionOptions.some((dimensionOption) => dimensionOption.value === selectedDimension)) {
      setSelectedDimension(availableDimensionOptions[0]?.value ?? '')
    }
  }, [availableDimensionOptions, selectedDimension])

  useEffect(() => {
    if (!availableMeasureOptions.some((measureOption) => measureOption.value === selectedMeasure)) {
      setSelectedMeasure(availableMeasureOptions[0]?.value ?? '')
    }
  }, [availableMeasureOptions, selectedMeasure])

  return (
    <section
      className={joinClassNames('vbi-react-field-panel', className)}
      style={{
        display: 'grid',
        fontSize: 13,
        gap: 12,
        gridTemplateRows: 'auto minmax(0, 1fr)',
        lineHeight: 1.4,
        minHeight: 0,
        ...style,
      }}
    >
      <header>
        <strong>{title}</strong>
      </header>

      <div style={{ display: 'grid', gap: 12, gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1fr)', minHeight: 0 }}>
        <section style={{ display: 'grid', gap: 10, gridTemplateRows: 'auto minmax(0, 1fr)', minHeight: 0 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <strong style={sectionTitleStyle}>{dimensionsTitle}</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                aria-label="Available dimensions"
                onChange={(event) => {
                  setSelectedDimension(event.target.value)
                }}
                style={{ ...controlStyle, flex: 1 }}
                value={selectedDimension}
              >
                {availableDimensionOptions.length === 0 ? (
                  <option value="">No dimensions available</option>
                ) : (
                  availableDimensionOptions.map((dimensionOption) => (
                    <option key={dimensionOption.value} value={dimensionOption.value}>
                      {dimensionOption.label ?? dimensionOption.value}
                    </option>
                  ))
                )}
              </select>
              <button
                disabled={!selectedDimension}
                onClick={() => {
                  if (!selectedDimension) {
                    return
                  }

                  addDimension(selectedDimension)
                }}
                style={actionButtonStyle}
                type="button"
              >
                Add dimension
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, minHeight: 0, overflow: 'hidden' }}>
            <ul
              aria-label="Selected dimensions"
              style={{
                alignContent: 'start',
                display: 'grid',
                gap: 6,
                listStyle: 'none',
                margin: 0,
                minHeight: 0,
                overflowY: 'auto',
                padding: 8,
              }}
            >
              {dimensions.map((dimension) => (
                <li key={dimension.id} style={fieldCardStyle}>
                  <div>
                    <strong style={{ fontSize: 12 }}>{dimension.alias || dimension.field}</strong>
                    <div style={{ color: '#5f6673', fontSize: 12 }}>{dimension.field}</div>
                  </div>
                  <label style={{ ...sectionTitleStyle, display: 'grid', gap: 4 }}>
                    <span>Alias</span>
                    <input
                      aria-label={`Alias for dimension ${dimension.field}`}
                      onChange={(event) => {
                        updateDimension(dimension.id, { alias: event.target.value })
                      }}
                      style={controlStyle}
                      value={dimension.alias ?? ''}
                    />
                  </label>
                  <button
                    onClick={() => {
                      removeDimension(dimension.id)
                    }}
                    style={actionButtonStyle}
                    type="button"
                  >
                    Remove dimension {dimension.field}
                  </button>
                </li>
              ))}
              {dimensions.length === 0 ? <li>No dimensions selected.</li> : null}
            </ul>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 10, gridTemplateRows: 'auto minmax(0, 1fr)', minHeight: 0 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <strong style={sectionTitleStyle}>{measuresTitle}</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                aria-label="Available measures"
                onChange={(event) => {
                  setSelectedMeasure(event.target.value)
                }}
                style={{ ...controlStyle, flex: 1 }}
                value={selectedMeasure}
              >
                {availableMeasureOptions.length === 0 ? (
                  <option value="">No measures available</option>
                ) : (
                  availableMeasureOptions.map((measureOption) => (
                    <option key={measureOption.value} value={measureOption.value}>
                      {measureOption.label ?? measureOption.value}
                    </option>
                  ))
                )}
              </select>
              <button
                disabled={!selectedMeasure}
                onClick={() => {
                  if (!selectedMeasure) {
                    return
                  }

                  addMeasure(selectedMeasure)
                }}
                style={actionButtonStyle}
                type="button"
              >
                Add measure
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, minHeight: 0, overflow: 'hidden' }}>
            <ul
              aria-label="Selected measures"
              style={{
                alignContent: 'start',
                display: 'grid',
                gap: 6,
                listStyle: 'none',
                margin: 0,
                minHeight: 0,
                overflowY: 'auto',
                padding: 8,
              }}
            >
              {measures.map((measure) => (
                <li key={measure.id} style={fieldCardStyle}>
                  <div>
                    <strong style={{ fontSize: 12 }}>{measure.alias || measure.field}</strong>
                    <div style={{ color: '#5f6673', fontSize: 12 }}>{measure.field}</div>
                  </div>
                  <label style={{ ...sectionTitleStyle, display: 'grid', gap: 4 }}>
                    <span>Alias</span>
                    <input
                      aria-label={`Alias for measure ${measure.field}`}
                      onChange={(event) => {
                        updateMeasure(measure.id, { alias: event.target.value })
                      }}
                      style={controlStyle}
                      value={measure.alias ?? ''}
                    />
                  </label>
                  <label style={{ ...sectionTitleStyle, display: 'grid', gap: 4 }}>
                    <span>Aggregate</span>
                    <select
                      aria-label={`Aggregate for measure ${measure.field}`}
                      onChange={(event) => {
                        updateMeasure(measure.id, {
                          aggregate: { func: event.target.value as MeasureAggregateFunction },
                        })
                      }}
                      style={controlStyle}
                      value={measure.aggregate?.func ?? 'sum'}
                    >
                      {measureAggregateOptions.map((aggregateOption) => (
                        <option key={aggregateOption.value} value={aggregateOption.value}>
                          {aggregateOption.label ?? aggregateOption.value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={{ ...sectionTitleStyle, display: 'grid', gap: 4 }}>
                    <span>Encoding</span>
                    <select
                      aria-label={`Encoding for measure ${measure.field}`}
                      onChange={(event) => {
                        updateMeasure(measure.id, {
                          encoding: event.target.value as NonNullable<VBIMeasure['encoding']>,
                        })
                      }}
                      style={controlStyle}
                      value={measure.encoding ?? 'yAxis'}
                    >
                      {measureEncodingOptions.map((encodingOption) => (
                        <option key={encodingOption.value} value={encodingOption.value}>
                          {encodingOption.label ?? encodingOption.value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={() => {
                      removeMeasure(measure.id)
                    }}
                    style={actionButtonStyle}
                    type="button"
                  >
                    Remove measure {measure.field}
                  </button>
                </li>
              ))}
              {measures.length === 0 ? <li>No measures selected.</li> : null}
            </ul>
          </div>
        </section>
      </div>
    </section>
  )
}
