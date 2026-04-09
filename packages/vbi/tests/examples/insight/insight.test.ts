import { rs } from '@rstest/core'
import { VBI, type VBIInsightBuilder } from '@visactor/vbi'
import { registerDemoConnector } from '../../demoConnector'

const MOCK_SYSTEM_TIME = new Date('2026-03-23T00:00:00.000Z')

describe('Insight', () => {
  beforeAll(async () => {
    rs.useFakeTimers({ toFake: ['Date'] })
    rs.setSystemTime(MOCK_SYSTEM_TIME)
    registerDemoConnector()
  })

  afterAll(() => {
    rs.useRealTimers()
  })

  it('basic-content', async () => {
    const builder = VBI.createInsight({
      content: '',
      version: 0,
    })

    const applyBuilder = (builder: VBIInsightBuilder) => {
      builder.setContent('本周华东区域销售额持续增长，建议继续跟进重点客户。')
    }
    applyBuilder(builder)

    const insightDSL = builder.build()
    expect(insightDSL).toMatchInlineSnapshot(`
      {
        "content": "本周华东区域销售额持续增长，建议继续跟进重点客户。",
        "uuid": "uuid-1",
        "version": 0,
      }
    `)
  })
})
