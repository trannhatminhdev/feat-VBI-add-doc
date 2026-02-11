import { Factory } from '../../../../src'
import basicVSeed from './basic.json'

test('racePie basic', async () => {
  const spec = await Factory.createVChartSpec(basicVSeed as any)
  expect(spec).toMatchSnapshot()
})
