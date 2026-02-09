/**
 * 内置工具库逻辑测试
 * @description 测试工具函数的纯逻辑（不依赖 Worker）
 */

import { describe, it, expect } from 'vitest'
import { BUILTIN_UTILS_SOURCE } from '../../../src/pipeline/utils/sandbox/builtin-utils'

describe('内置工具库 - 纯函数逻辑', () => {
  // 在本地执行环境中运行内置工具库
  let _: any
  let R: any

  beforeAll(() => {
    // 在当前上下文中执行工具库代码
    const context = { self: {} as any }
    const fn = new Function('self', BUILTIN_UTILS_SOURCE)
    fn(context.self)
    _ = context.self._
    R = context.self.R
  })

  describe('数组操作', () => {
    const data = [
      { id: 1, name: 'Alice', age: 25, score: 85 },
      { id: 2, name: 'Bob', age: 30, score: 92 },
      { id: 3, name: 'Charlie', age: 25, score: 78 },
    ]

    it('map - 映射数组', () => {
      const result = _.map(data, 'name')
      expect(result).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('filter - 筛选数组', () => {
      const result = _.filter(data, (item: any) => item.age > 25)
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Bob')
    })

    it('filter - 对象匹配', () => {
      const result = _.filter(data, { age: 25 })
      expect(result).toHaveLength(2)
    })

    it('find - 查找元素', () => {
      const result = _.find(data, (item: any) => item.name === 'Bob')
      expect(result.id).toBe(2)
    })

    it('groupBy - 分组', () => {
      const result = _.groupBy(data, 'age')
      expect(result['25']).toHaveLength(2)
      expect(result['30']).toHaveLength(1)
    })

    it('sortBy - 排序', () => {
      const result = _.sortBy(data, 'score')
      expect(result[0].score).toBe(78)
      expect(result[2].score).toBe(92)
    })

    it('uniqBy - 去重', () => {
      const result = _.uniqBy(data, 'age')
      expect(result).toHaveLength(2) // 25, 30
    })
  })

  describe('数学统计', () => {
    it('sum - 求和', () => {
      expect(_.sum([1, 2, 3, 4, 5])).toBe(15)
    })

    it('sumBy - 按字段求和', () => {
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }]
      expect(_.sumBy(data, 'value')).toBe(60)
    })

    it('mean - 平均值', () => {
      expect(_.mean([10, 20, 30, 40])).toBe(25)
    })

    it('meanBy - 按字段平均', () => {
      const data = [{ value: 10 }, { value: 20 }, { value: 30 }]
      expect(_.meanBy(data, 'value')).toBe(20)
    })

    it('max - 最大值', () => {
      expect(_.max([10, 5, 30, 15])).toBe(30)
    })

    it('min - 最小值', () => {
      expect(_.min([10, 5, 30, 15])).toBe(5)
    })

    it('countBy - 计数', () => {
      const data = [{ type: 'A' }, { type: 'B' }, { type: 'A' }]
      const result = _.countBy(data, 'type')
      expect(result).toEqual({ A: 2, B: 1 })
    })
  })

  describe('对象操作', () => {
    it('pick - 选择字段', () => {
      const obj = { id: 1, name: 'Alice', age: 25, email: 'alice@example.com' }
      const result = _.pick(obj, ['id', 'name'])
      expect(result).toEqual({ id: 1, name: 'Alice' })
    })

    it('omit - 排除字段', () => {
      const obj = { id: 1, name: 'Alice', age: 25 }
      const result = _.omit(obj, ['age'])
      expect(result).toEqual({ id: 1, name: 'Alice' })
    })

    it('get - 安全访问嵌套属性', () => {
      const obj = { user: { profile: { name: 'Alice' } } }
      expect(_.get(obj, 'user.profile.name')).toBe('Alice')
      expect(_.get(obj, 'user.missing', 'default')).toBe('default')
    })

    it('keys - 对象键', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(_.keys(obj)).toEqual(['a', 'b', 'c'])
    })

    it('values - 对象值', () => {
      const obj = { a: 1, b: 2, c: 3 }
      expect(_.values(obj)).toEqual([1, 2, 3])
    })
  })

  describe('数据判断', () => {
    it('isArray', () => {
      expect(_.isArray([1, 2, 3])).toBe(true)
      expect(_.isArray('not array')).toBe(false)
    })

    it('isObject', () => {
      expect(_.isObject({})).toBe(true)
      expect(_.isObject([])).toBe(false)
      expect(_.isObject(null)).toBe(false)
    })

    it('isEmpty', () => {
      expect(_.isEmpty([])).toBe(true)
      expect(_.isEmpty({})).toBe(true)
      expect(_.isEmpty('')).toBe(true)
      expect(_.isEmpty([1])).toBe(false)
    })

    it('isNil', () => {
      expect(_.isNil(null)).toBe(true)
      expect(_.isNil(undefined)).toBe(true)
      expect(_.isNil(0)).toBe(false)
    })
  })

  describe('Ramda 兼容性', () => {
    it('R.* 应该与 _.* 相同', () => {
      const data = [1, 2, 3, 4, 5]
      expect(R.map(data, (x: any) => x * 2)).toEqual(_.map(data, (x: any) => x * 2))
      expect(R.filter(data, (x: any) => x > 3)).toEqual(_.filter(data, (x: any) => x > 3))
      expect(R.sum(data)).toEqual(_.sum(data))
    })
  })

  describe('复杂场景', () => {
    it('组合操作 - 数据聚合', () => {
      const data = [
        { category: 'A', value: 100 },
        { category: 'B', value: 200 },
        { category: 'A', value: 150 },
        { category: 'B', value: 250 },
      ]

      const grouped = _.groupBy(data, 'category')
      const result = _.map(_.keys(grouped), (key: any) => ({
        category: key,
        total: _.sumBy(grouped[key], 'value'),
        count: grouped[key].length,
      }))
      const sorted = _.sortBy(result, 'total')

      expect(sorted).toHaveLength(2)
      expect(sorted[0].category).toBe('A')
      expect(sorted[0].total).toBe(250)
      expect(sorted[1].category).toBe('B')
      expect(sorted[1].total).toBe(450)
    })
  })
})
