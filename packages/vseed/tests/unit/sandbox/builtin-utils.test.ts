/**
 * 内置工具库测试
 * @description 验证内置工具库的常用功能
 */

import { describe, it, expect } from 'vitest'
import { executeFilterCode } from '../../../src/pipeline/utils/sandbox/execute'

describe('内置工具库 - 数组操作', () => {
  const data = [
    { id: 1, name: 'Alice', age: 25, score: 85 },
    { id: 2, name: 'Bob', age: 30, score: 92 },
    { id: 3, name: 'Charlie', age: 25, score: 78 },
    { id: 4, name: 'David', age: 35, score: 95 },
  ]

  it('_.map - 数组映射', async () => {
    const code = 'return _.map(data, item => item.name);'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data).toEqual(['Alice', 'Bob', 'Charlie', 'David'])
  })

  it('_.filter - 数组筛选', async () => {
    const code = 'return _.filter(data, item => item.age > 25);'
    const result = await executeFilterCode({ code, data }) as any
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(result.data?.[0].name).toBe('Bob')
  })

  it('_.find - 查找元素', async () => {
    const code = 'return [_.find(data, item => item.name === "Bob")];'
    const result = await executeFilterCode({ code, data }) as any
    expect(result.success).toBe(true)
    expect(result.data?.[0].id).toBe(2)
  })

  it('_.groupBy - 分组', async () => {
    const code = 'return [_.groupBy(data, "age")];'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    const grouped = result.data?.[0] as Record<string, any[]>
    expect(grouped['25']).toHaveLength(2)
    expect(grouped['30']).toHaveLength(1)
  })

  it('_.sortBy - 排序', async () => {
    const code = 'return _.sortBy(data, "score");'
    const result = await executeFilterCode({ code, data }) as any
    expect(result.success).toBe(true)
    expect(result.data?.[0].score).toBe(78)
    expect(result.data?.[3].score).toBe(95)
  })

  it('_.uniqBy - 去重', async () => {
    const code = 'return _.uniqBy(data, "age");'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(3) // 25, 30, 35
  })
})

describe('内置工具库 - 数学统计', () => {
  const data = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 40 },
  ]

  it('_.sum - 求和', async () => {
    const code = 'return [_.sum([1, 2, 3, 4, 5])];'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toBe(15)
  })

  it('_.sumBy - 按字段求和', async () => {
    const code = 'return [_.sumBy(data, "value")];'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toBe(100)
  })

  it('_.mean - 平均值', async () => {
    const code = 'return [_.mean([10, 20, 30, 40])];'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toBe(25)
  })

  it('_.max / _.min - 最大最小值', async () => {
    const code = 'return [_.max([10, 20, 30]), _.min([10, 20, 30])];'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toBe(30)
    expect(result.data?.[1]).toBe(10)
  })

  it('_.countBy - 计数', async () => {
    const dataset = [
      { type: 'A' },
      { type: 'B' },
      { type: 'A' },
      { type: 'C' },
      { type: 'A' },
    ]
    const code = 'return [_.countBy(data, "type")];'
    const result = await executeFilterCode({ code, data: dataset })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toEqual({ A: 3, B: 1, C: 1 })
  })
})

describe('内置工具库 - 对象操作', () => {
  it('_.pick - 选择字段', async () => {
    const data = [{ id: 1, name: 'Alice', age: 25, email: 'alice@example.com' }]
    const code = 'return data.map(item => _.pick(item, ["id", "name"]));'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toEqual({ id: 1, name: 'Alice' })
  })

  it('_.omit - 排除字段', async () => {
    const data = [{ id: 1, name: 'Alice', age: 25 }]
    const code = 'return data.map(item => _.omit(item, ["age"]));'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toEqual({ id: 1, name: 'Alice' })
  })

  it('_.get - 安全访问嵌套属性', async () => {
    const data = [{ user: { profile: { name: 'Alice' } } }]
    const code = 'return [_.get(data[0], "user.profile.name"), _.get(data[0], "user.missing", "default")];'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data?.[0]).toBe('Alice')
    expect(result.data?.[1]).toBe('default')
  })
})

describe('内置工具库 - 兼容 Ramda 风格', () => {
  it('使用 R.* API（与 _.* 相同）', async () => {
    const data = [{ id: 1, value: 10 }, { id: 2, value: 20 }]
    const code = 'return R.map(data, item => item.value);'
    const result = await executeFilterCode({ code, data })
    expect(result.success).toBe(true)
    expect(result.data).toEqual([10, 20])
  })
})

describe('内置工具库 - 复杂业务场景', () => {
  it('数据统计与筛选组合', async () => {
    const data = [
      { category: 'A', value: 100 },
      { category: 'B', value: 200 },
      { category: 'A', value: 150 },
      { category: 'B', value: 250 },
    ]

    // 按类别分组并计算总和
    const code = `
      const grouped = _.groupBy(data, 'category');
      const result = _.map(_.keys(grouped), key => ({
        category: key,
        total: _.sumBy(grouped[key], 'value'),
        count: grouped[key].length,
        avg: _.meanBy(grouped[key], 'value')
      }));
      return _.sortBy(result, 'total');
    `

    const result = await executeFilterCode({ code, data }) as any
    expect(result.success).toBe(true)
    expect(result.data).toHaveLength(2)
    expect(result.data?.[0].category).toBe('A')
    expect(result.data?.[0].total).toBe(250)
    expect(result.data?.[1].category).toBe('B')
    expect(result.data?.[1].total).toBe(450)
  })
})
