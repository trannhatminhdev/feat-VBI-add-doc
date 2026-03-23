import { render, waitFor } from '@testing-library/react'

import { ChartRenderer } from '@visactor/vbi-react/components'

import { createTestBuilder } from '../utils/createTestBuilder'

describe('ChartRenderer', () => {
  it('renders VSeed content through the render prop', async () => {
    const builder = createTestBuilder({
      query: async () => ({
        dataset: [{ value: 1 }],
      }),
    })

    const view = render(
      <ChartRenderer builder={builder} debounce={0} renderVSeed={(vseed) => <div>Rows: {vseed.dataset.length}</div>} />,
    )

    expect(view.getByText(/Loading chart/)).toBeTruthy()

    await waitFor(() => {
      expect(view.getByText('Rows: 1')).toBeTruthy()
    })
  })
})
