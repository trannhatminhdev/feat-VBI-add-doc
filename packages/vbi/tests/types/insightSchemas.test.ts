import { zVBIInsightDSL } from 'src/types/insightDSL/insight'
import { generateEmptyInsightDSL } from 'src/vbi/generate-empty-insight-dsl'

describe('insight DSL schemas', () => {
  test('parse minimal insight DSL', () => {
    expect(zVBIInsightDSL.parse(generateEmptyInsightDSL())).toEqual({
      uuid: 'uuid-1',
      content: '',
      version: 0,
    })
  })

  test('empty insight helper stays stable', () => {
    expect(generateEmptyInsightDSL()).toEqual({
      uuid: 'uuid-1',
      content: '',
      version: 0,
    })
  })

  test('insight helper accepts custom uuid', () => {
    expect(generateEmptyInsightDSL('insight-uuid')).toEqual({
      uuid: 'insight-uuid',
      content: '',
      version: 0,
    })
  })
})
