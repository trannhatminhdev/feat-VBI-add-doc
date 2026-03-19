import { fireEvent, render } from '@testing-library/react'

import { ChartTypeSelector } from '@visactor/vbi-react/components'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('ChartTypeSelector component', () => {
  it('renders chart types and updates the builder', () => {
    const builder = createTestBuilder()

    const view = render(<ChartTypeSelector builder={builder} />)

    const select = view.getByRole('combobox', { name: 'Chart type' })
    expect(select).toBeTruthy()
    expect(view.getByRole('option', { name: 'table' })).toBeTruthy()
    expect(view.getByRole('option', { name: 'line' })).toBeTruthy()

    fireEvent.change(select, { target: { value: 'line' } })

    expect(builder.chartType.getChartType()).toBe('line')
  })
})
