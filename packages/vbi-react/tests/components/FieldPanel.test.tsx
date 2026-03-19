import { fireEvent, render } from '@testing-library/react'

import { FieldPanel } from '@visactor/vbi-react/components'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('FieldPanel', () => {
  it('adds and updates dimensions and measures through hooks', () => {
    const builder = createTestBuilder()

    const view = render(
      <FieldPanel
        builder={builder}
        dimensionOptions={[{ label: 'Region', value: 'region' }]}
        measureOptions={[{ label: 'Sales', value: 'sales' }]}
      />,
    )

    fireEvent.click(view.getByRole('button', { name: 'Add dimension' }))
    fireEvent.click(view.getByRole('button', { name: 'Add measure' }))

    expect(view.getByLabelText('Alias for dimension region')).toBeTruthy()
    expect(view.getByLabelText('Alias for measure sales')).toBeTruthy()

    fireEvent.change(view.getByLabelText('Aggregate for measure sales'), {
      target: { value: 'avg' },
    })
    fireEvent.change(view.getByLabelText('Encoding for measure sales'), {
      target: { value: 'color' },
    })

    expect(builder.dimensions.toJSON()[0].field).toBe('region')
    expect(builder.measures.toJSON()[0].aggregate).toEqual({ func: 'avg' })
    expect(builder.measures.toJSON()[0].encoding).toBe('color')

    fireEvent.click(view.getByRole('button', { name: 'Remove measure sales' }))

    expect(builder.measures.toJSON()).toHaveLength(0)
  })
})
