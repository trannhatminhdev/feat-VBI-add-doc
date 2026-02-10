/**
 * 安全验证函数测试
 * @description 测试核心的安全检查逻辑（不依赖 Worker）
 */

import { describe, it, expect } from 'vitest'
import { validateCodeSafety } from '../../../src/pipeline/utils/sandbox/execute'

describe('安全验证 - 代码检查', () => {
  describe('检测危险操作', () => {
    it('应该拒绝 eval 调用', () => {
      expect(() => {
        validateCodeSafety('return eval("malicious code")')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝 Function 构造器', () => {
      expect(() => {
        validateCodeSafety('return new Function("return 1")')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝 import 语句', () => {
      expect(() => {
        validateCodeSafety('import fs from "fs"; return data;')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝 fetch 调用', () => {
      expect(() => {
        validateCodeSafety('return fetch("http://evil.com")')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝 XMLHttpRequest', () => {
      expect(() => {
        validateCodeSafety('return new XMLHttpRequest()')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝原型链污染', () => {
      expect(() => {
        validateCodeSafety('Object.prototype.hack = 1; return data;')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝 __proto__ 访问', () => {
      expect(() => {
        validateCodeSafety('obj.__proto__ = {}; return obj;')
      }).toThrow(/forbidden|security/i)
    })

    it('应该拒绝 constructor 属性访问', () => {
      expect(() => {
        validateCodeSafety('return obj.constructor.constructor')
      }).toThrow(/forbidden|security/i)
    })
  })

  describe('允许安全操作', () => {
    it('应该允许基本数组操作', () => {
      expect(() => {
        validateCodeSafety('return _.map(data, item => item.value)')
      }).not.toThrow()
    })

    it('应该允许对象操作', () => {
      expect(() => {
        validateCodeSafety('return _.groupBy(data, "category")')
      }).not.toThrow()
    })

    it('应该允许数学计算', () => {
      expect(() => {
        validateCodeSafety('return _.sumBy(data, "amount")')
      }).not.toThrow()
    })

    it('应该允许复杂业务逻辑', () => {
      const code = `
        const filtered = _.filter(data, item => item.active);
        const grouped = _.groupBy(filtered, 'category');
        return _.map(_.keys(grouped), key => ({
          category: key,
          total: _.sumBy(grouped[key], 'value')
        }));
      `
      expect(() => {
        validateCodeSafety(code)
      }).not.toThrow()
    })
  })

  describe('边缘情况', () => {
    it('应该拒绝空代码', () => {
      expect(() => {
        validateCodeSafety('')
      }).toThrow(/empty|cannot be empty/i)
    })

    // 注意：为了安全，即使在注释中也会拒绝危险关键字
    // 这是一种保守的安全策略
    it('应该拒绝注释中包含危险关键字（安全优先）', () => {
      const code = `
        // 这里不应该使用 eval
        return _.map(data, 'name');
      `
      expect(() => {
        validateCodeSafety(code)
      }).toThrow(/forbidden|security/i)
    })

    // 同理，字符串中的危险关键字也会被拒绝
    it('应该拒绝字符串中包含危险关键字（安全优先）', () => {
      const code = `
        const message = "Don't use eval!";
        return data;
      `
      expect(() => {
        validateCodeSafety(code)
      }).toThrow(/forbidden|security/i)
    })
    
    // 但不包含危险关键字的安全代码应该通过
    it('应该允许不包含危险关键字的代码', () => {
      const code = `
        // 安全的数据处理
        const filtered = _.filter(data, item => item.active);
        return _.map(filtered, 'name');
      `
      expect(() => {
        validateCodeSafety(code)
      }).not.toThrow()
    })
  })
})
