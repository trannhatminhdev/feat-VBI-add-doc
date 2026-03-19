import { render } from '@testing-library/react'

import { BuilderLayout } from '@visactor/vbi-react/components'

describe('BuilderLayout', () => {
  it('renders the provided layout slots', () => {
    const view = render(
      <BuilderLayout
        footer={<div>Footer slot</div>}
        leftPanel={<div>Left slot</div>}
        main={<div>Main slot</div>}
        rightPanel={<div>Right slot</div>}
        topBar={<div>Top slot</div>}
      />,
    )

    expect(view.getByText('Top slot')).toBeTruthy()
    expect(view.getByText('Left slot')).toBeTruthy()
    expect(view.getByText('Main slot')).toBeTruthy()
    expect(view.getByText('Right slot')).toBeTruthy()
    expect(view.getByText('Footer slot')).toBeTruthy()
  })
})
