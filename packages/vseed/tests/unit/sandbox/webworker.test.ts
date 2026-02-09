/**
 * 安全沙箱测试套件
 * @description 包含安全性测试和功能测试
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import {
  enhancedValidateCodeSafety,
  executeFilterCode,
  tryExecuteFilterCode,
  initializeWorkerPool,
  terminateWorkerPool,
} from '../../../src/pipeline/utils/sandbox/execute'

const workerSupported =
  typeof Worker !== 'undefined' &&
  typeof Blob !== 'undefined' &&
  typeof URL !== 'undefined' &&
  typeof URL.createObjectURL === 'function'

const testIfWorker = workerSupported ? test : test.skip

// 测试数据
const sampleData = [
  { id: 1, category: 'Electronics', sales: 1200, profit: 360 },
  { id: 2, category: 'Clothing', sales: 800, profit: 240 },
  { id: 3, category: 'Electronics', sales: 2500, profit: 750 },
  { id: 4, category: 'Food', sales: 600, profit: 120 },
  { id: 5, category: 'Clothing', sales: 1500, profit: 450 },
]

describe('Enhanced Secure Code Executor', () => {
  beforeAll(async () => {
    // 预热 Worker 池（使用默认 CDN）
    // 生产环境建议使用内联源码
    if (workerSupported) {
      await initializeWorkerPool()
    }
  })

  afterAll(() => {
    if (workerSupported) {
      terminateWorkerPool()
    }
  })

  // ============================================
  // 安全性测试
  // ============================================
  describe('Security Tests', () => {
    test('应该拒绝 eval', () => {
      const code = 'eval("alert(1)"); return data;'
      expect(() => enhancedValidateCodeSafety(code)).toThrow(/eval/)
    })

    test('应该拒绝 Function 构造器', () => {
      const code = 'new Function("alert(1)")(); return data;'
      expect(() => enhancedValidateCodeSafety(code)).toThrow(/Function/)
    })

    test('应该拒绝 constructor 访问', () => {
      const maliciousCodes = [
        'this.constructor.constructor("alert(1)")(); return data;',
        'data.constructor.constructor("alert(1)")(); return data;',
        "data['constructor']['constructor']('alert(1)')(); return data;",
      ]

      for (const code of maliciousCodes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/constructor/)
      }
    })

    test('应该拒绝原型链操作', () => {
      const codes = [
        'Object.prototype.isAdmin = true; return data;',
        'data.__proto__.isAdmin = true; return data;',
        'Object.setPrototypeOf(data, {}); return data;',
        'Object.getPrototypeOf(data); return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/Security violation/)
      }
    })

    test('应该拒绝网络请求', () => {
      const codes = [
        'fetch("https://evil.com"); return data;',
        'new XMLHttpRequest(); return data;',
        'new WebSocket("ws://evil.com"); return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/fetch|XMLHttpRequest|WebSocket/)
      }
    })

    test('应该拒绝全局对象访问', () => {
      const codes = [
        'window.location.href = "https://evil.com"; return data;',
        'document.cookie; return data;',
        'globalThis.alert(1); return data;',
        'self["constructor"]; return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/Security violation/)
      }
    })

    test('应该拒绝异步操作', () => {
      const codes = [
        'async function hack() {}; return data;',
        'await fetch("https://evil.com"); return data;',
        'new Promise(resolve => resolve()); return data;',
        'data.then(x => x); return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/Security violation/)
      }
    })

    test('应该拒绝动态代码生成', () => {
      const codes = [
        'Function.prototype.call.apply(eval, ["alert(1)"]); return data;',
        'eval.call(null, "alert(1)"); return data;',
        'Function.prototype.bind.call(eval)("alert(1)"); return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/apply|call|bind|eval/)
      }
    })

    test('应该拒绝字符串拼接绕过', () => {
      const codes = [
        'const x = "con" + "structor"; return data;',
        'const y = "ev" + "al"; return data;',
        'self["con" + "structor"]; return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/Security violation|suspicious/)
      }
    })

    test('应该拒绝生成器函数', () => {
      const codes = ['function* gen() { yield 1; }; return data;', 'const gen = function*() { yield 1; }; return data;']

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/generator|yield/)
      }
    })

    test('应该拒绝 Worker 创建', () => {
      const codes = [
        'new Worker("evil.js"); return data;',
        'new SharedWorker("evil.js"); return data;',
        'navigator.serviceWorker.register("evil.js"); return data;',
      ]

      for (const code of codes) {
        expect(() => enhancedValidateCodeSafety(code)).toThrow(/Security violation/)
      }
    })
  })

  // ============================================
  // 功能测试（使用 lodash）
  // ============================================
  describe('Functional Tests (Lodash)', () => {
    testIfWorker('应该能执行简单的筛选', async () => {
      const code = `
        const result = _.filter(data, item => item.sales > 1000);
        return result;
      `

      const result = await executeFilterCode({
        code,
        data: sampleData,
      })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(3)
      expect(result.data.every((item) => item.sales > 1000)).toBe(true)
    })

    testIfWorker('应该能执行排序', async () => {
      const code = `
        const result = _.orderBy(data, ['sales'], ['desc']);
        return result;
      `

      const result = await executeFilterCode({
        code,
        data: sampleData,
      }) as any

      expect(result.success).toBe(true)
      expect(result.data[0].sales).toBe(2500)
      expect(result.data[result.data.length - 1].sales).toBe(600)
    })

    testIfWorker('应该能执行 Top N', async () => {
      const code = `
        const result = _.chain(data)
          .orderBy(['sales'], ['desc'])
          .take(2)
          .value();
        return result;
      `

      const result = (await executeFilterCode({
        code,
        data: sampleData,
      })) as any

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data[0].sales).toBe(2500)
      expect(result.data[1].sales).toBe(1500)
    })

    testIfWorker('应该能执行分组', async () => {
      const code = `
        const grouped = _.groupBy(data, 'category');
        const result = _.map(grouped, (items, category) => ({
          category,
          count: items.length,
          totalSales: _.sumBy(items, 'sales')
        }));
        return result;
      `

      const result = (await executeFilterCode({
        code,
        data: sampleData,
      })) as any

      expect(result.success).toBe(true)
      const electronics = result.data.find((item: any) => item.category === 'Electronics')
      expect(electronics?.count).toBe(2)
      expect(electronics?.totalSales).toBe(3700)
    })

    testIfWorker('应该能执行统计分析', async () => {
      const code = `
        const avgSales = _.meanBy(data, 'sales');
        const stdDev = Math.sqrt(
          _.meanBy(data, item => Math.pow(item.sales - avgSales, 2))
        );
        
        const result = _.filter(data, item => item.sales > avgSales + stdDev);
        return result;
      `

      const result = await executeFilterCode({
        code,
        data: sampleData,
      }) as any

      expect(result.success).toBe(true)
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThan(0)
    })

    testIfWorker('应该能处理复杂的逻辑', async () => {
      const code = `
        const result = _.chain(data)
          .filter(item => {
            const profitMargin = (item.profit / item.sales) * 100;
            return profitMargin >= 25 && item.sales >= 1000;
          })
          .sortBy('sales')
          .reverse()
          .value();
        return result;
      `

      const result = await executeFilterCode({
        code,
        data: sampleData,
      })

      expect(result.success).toBe(true)
      expect(Array.isArray(result.data)).toBe(true)
      result.data.forEach((item) => {
        const margin = (item.profit / item.sales) * 100
        expect(margin).toBeGreaterThanOrEqual(25)
        expect(item.sales).toBeGreaterThanOrEqual(1000)
      })
    })
  })

  // ============================================
  // 边界测试
  // ============================================
  describe('Edge Cases', () => {
    test('应该拒绝空代码', () => {
      expect(() => enhancedValidateCodeSafety('')).toThrow(/empty/)
    })

    test('应该拒绝没有 return 的代码', () => {
      const code = 'const x = 1; const y = 2;'
      expect(() => enhancedValidateCodeSafety(code)).toThrow(/return/)
    })

    test('应该拒绝过长的代码', () => {
      const code = 'const x = 1; return data;' + ' '.repeat(50000)
      expect(() => enhancedValidateCodeSafety(code)).toThrow(/too long/)
    })

    testIfWorker('应该拒绝非数组返回值', async () => {
      const code = 'return { foo: "bar" };'

      const result = await executeFilterCode({
        code,
        data: sampleData,
      })

      expect(result.success).toBe(false)
      expect(result.error).toMatch(/must return an array/)
    })

    testIfWorker('应该处理空数组', async () => {
      const code = 'return _.filter(data, item => item.sales > 10000);'

      const result = await executeFilterCode({
        code,
        data: sampleData,
      })

      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    testIfWorker('应该处理超时', async () => {
      const code = `
        let sum = 0;
        for (let i = 0; i < 1e9; i++) {
          sum += i;
        }
        return data;
      `

      const result = await executeFilterCode({
        code,
        data: sampleData,
        timeout: 1000, // 1 秒超时
      })

      if (!result.success) {
        expect(result.error).toMatch(/timeout/)
      }
    }, 10000) // Vitest 超时设为 10 秒
  })

  // ============================================
  // 降级测试
  // ============================================
  describe('Fallback Tests', () => {
    testIfWorker('tryExecuteFilterCodeEnhanced 应该在失败时返回降级数据', async () => {
      const code = 'throw new Error("Intentional error"); return data;'
      const fallback = [{ id: 999, category: 'Fallback' }]

      const result = await tryExecuteFilterCode(
        {
          code,
          data: sampleData,
        },
        fallback,
      )

      expect(result.data).toEqual(fallback)
    })

    testIfWorker('tryExecuteFilterCodeEnhanced 应该在成功时返回结果', async () => {
      const code = 'return _.take(data, 2);'

      const result = await tryExecuteFilterCode(
        {
          code,
          data: sampleData,
        },
        [],
      )

      expect(result.data).toHaveLength(2)
    })
  })

  // ============================================
  // 性能测试
  // ============================================
  describe('Performance Tests', () => {
    testIfWorker('Worker 池应该复用实例', async () => {
      const code = 'return _.take(data, 1);'

      const start1 = Date.now()
      await executeFilterCode({ code, data: sampleData })
      const time1 = Date.now() - start1

      const start2 = Date.now()
      await executeFilterCode({ code, data: sampleData })
      const time2 = Date.now() - start2

      // 第二次应该更快（复用 Worker）
      // 注意：这个测试可能不稳定，取决于系统负载
      expect(time2).toBeLessThanOrEqual(time1)
    })

    testIfWorker('应该处理大数据集', async () => {
      const largeData = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
      }))

      const code = `
        const result = _.chain(data)
          .filter(item => item.value > 500)
          .sortBy('value')
          .take(100)
          .value();
        return result;
      `

      const start = Date.now()
      const result = await executeFilterCode({
        code,
        data: largeData,
        timeout: 10000,
      })
      const time = Date.now() - start

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(100)
      expect(time).toBeLessThan(5000) // 应该在 5 秒内完成
    }, 15000)
  })

  // ============================================
  // 内置工具库测试
  // ============================================
  describe('Built-in Utils Tests', () => {
    testIfWorker('应该使用内置的 lodash 兼容工具', async () => {
      const code = 'return _.take(_.filter(data, item => item.sales > 1000), 2);'

      const result = await executeFilterCode({
        code,
        data: sampleData,
      })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.sales > 1000)).toBe(true)
    })

    testIfWorker('应该支持 Ramda 风格的 API', async () => {
      const code = `
        const filtered = R.filter(item => item.sales > 1000, data);
        return R.take(2, filtered);
      `

      const result = await executeFilterCode({
        code,
        data: sampleData,
      })

      expect(result.success).toBe(true)
      expect(result.data).toHaveLength(2)
      expect(result.data.every((item) => item.sales > 1000)).toBe(true)
    })
  })
})
