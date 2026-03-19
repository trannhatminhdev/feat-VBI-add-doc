import { useEffect, useMemo, useState } from 'react'
import type { VBIBuilder, VBIMeasure } from '@visactor/vbi'

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

export interface FieldPanelProps extends BaseComponentProps {
  builder: VBIBuilder
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
    <section className={joinClassNames('vbi-react-field-panel', className)} style={{ display: 'grid', gap: 16, ...style }}>
      <header>
        <strong>{title}</strong>
      </header>

      <section style={{ display: 'grid', gap: 8 }}>
        <strong>{dimensionsTitle}</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            aria-label="Available dimensions"
            onChange={(event) => {
              setSelectedDimension(event.target.value)
            }}
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
            type="button"
          >
            Add dimension
          </button>
        </div>
        <ul style={{ display: 'grid', gap: 8, listStyle: 'none', margin: 0, padding: 0 }}>
          {dimensions.map((dimension) => (
            <li key={dimension.id} style={{ border: '1px solid #d9d9d9', display: 'grid', gap: 8, padding: 12 }}>
              <div>
                <strong>{dimension.alias || dimension.field}</strong>
                <div>{dimension.field}</div>
              </div>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Alias</span>
                <input
                  aria-label={`Alias for dimension ${dimension.field}`}
                  onChange={(event) => {
                    updateDimension(dimension.id, { alias: event.target.value })
                  }}
                  value={dimension.alias ?? ''}
                />
              </label>
              <button
                onClick={() => {
                  removeDimension(dimension.id)
                }}
                type="button"
              >
                Remove dimension {dimension.field}
              </button>
            </li>
          ))}
          {dimensions.length === 0 ? <li>No dimensions selected.</li> : null}
        </ul>
      </section>

      <section style={{ display: 'grid', gap: 8 }}>
        <strong>{measuresTitle}</strong>
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            aria-label="Available measures"
            onChange={(event) => {
              setSelectedMeasure(event.target.value)
            }}
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
            type="button"
          >
            Add measure
          </button>
        </div>
        <ul style={{ display: 'grid', gap: 8, listStyle: 'none', margin: 0, padding: 0 }}>
          {measures.map((measure) => (
            <li key={measure.id} style={{ border: '1px solid #d9d9d9', display: 'grid', gap: 8, padding: 12 }}>
              <div>
                <strong>{measure.alias || measure.field}</strong>
                <div>{measure.field}</div>
              </div>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Alias</span>
                <input
                  aria-label={`Alias for measure ${measure.field}`}
                  onChange={(event) => {
                    updateMeasure(measure.id, { alias: event.target.value })
                  }}
                  value={measure.alias ?? ''}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Aggregate</span>
                <select
                  aria-label={`Aggregate for measure ${measure.field}`}
                  onChange={(event) => {
                    updateMeasure(measure.id, {
                      aggregate: { func: event.target.value as MeasureAggregateFunction },
                    })
                  }}
                  value={measure.aggregate?.func ?? 'sum'}
                >
                  {measureAggregateOptions.map((aggregateOption) => (
                    <option key={aggregateOption.value} value={aggregateOption.value}>
                      {aggregateOption.label ?? aggregateOption.value}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Encoding</span>
                <select
                  aria-label={`Encoding for measure ${measure.field}`}
                  onChange={(event) => {
                    updateMeasure(measure.id, {
                      encoding: event.target.value as NonNullable<VBIMeasure['encoding']>,
                    })
                  }}
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
                type="button"
              >
                Remove measure {measure.field}
              </button>
            </li>
          ))}
          {measures.length === 0 ? <li>No measures selected.</li> : null}
        </ul>
      </section>
    </section>
  )
}
