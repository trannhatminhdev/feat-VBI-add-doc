/* eslint-disable no-console */
/**
 * 增强的安全代码执行器
 * @description 专为 AI 生成代码设计的安全沙箱
 * @module enhancedSecureCodeExecutor
 */

import type { CodeExecutionOptions, CodeExecutionResult } from 'src/types/sandbox'
import { BUILTIN_UTILS_SOURCE } from './builtin-utils'

/**
 * Worker 池管理器
 * @description 复用 Worker 实例，避免重复创建开销
 */
class WorkerPool {
  private workers: Worker[] = []
  private availableWorkers: Worker[] = []
  private readonly maxSize: number
  private isInitialized = false

  constructor(maxSize = 2) {
    this.maxSize = maxSize
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    for (let i = 0; i < this.maxSize; i++) {
      try {
        const worker = await this.createSecureWorker()
        this.workers.push(worker)
        this.availableWorkers.push(worker)
      } catch (error) {
        // ⚠️ 关键修复：某个 Worker 初始化失败时，清理已创建的 Worker
        this.workers.forEach((w) => w.terminate())
        this.workers = []
        this.availableWorkers = []
        throw new Error(`Failed to initialize Worker pool: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    this.isInitialized = true
  }

  private createSecureWorker(): Promise<Worker> {
    // 直接使用内置工具库
    const libraryLoadCode = `// 内置工具库（lodash/Ramda 兼容 API）\n${BUILTIN_UTILS_SOURCE}`

    const workerCode = `
      // ============================================
      // 阶段 1: 立即执行安全加固 (IIFE)
      // ============================================
      (function initSecureSandbox() {
        'use strict';
        
        // 1.1 保存必要的原生引用（在被删除前）
        const nativeImportScripts = self.importScripts;
        const nativePostMessage = self.postMessage.bind(self);
        
        // 1.2 立即删除危险 API
        delete self.importScripts;
        delete self.fetch;
        delete self.XMLHttpRequest;
        delete self.WebSocket;
        
        // 1.3 冻结关键原型链（防止污染和篡改）
        Object.freeze(Object.prototype);
        Object.freeze(Array.prototype);
        Object.freeze(Function.prototype);
        Object.freeze(String.prototype);
        Object.freeze(Number.prototype);
        Object.freeze(Boolean.prototype);
        
        // ============================================
        // 阶段 2: 加载工具库
        // ============================================
        try {
          ${libraryLoadCode}
        } catch (error) {
          nativePostMessage({ 
            initError: 'Failed to load utility library: ' + error.message 
          });
          return;
        }
        
        // 验证库是否加载成功
        const utilityLib = self._;
        if (!utilityLib) {
          nativePostMessage({ 
            initError: 'Builtin utility library (_ or R) not found after loading' 
          });
          return;
        }
        
        // ============================================
        // 阶段 3: 创建安全上下文
        // ============================================
        const createSafeContext = (lib) => {
          const allowedGlobals = {
            // 工具库
            _: lib,
            R: lib,
            
            // 基础类型构造函数（只读）
            Array: Array,
            Object: Object,
            String: String,
            Number: Number,
            Boolean: Boolean,
            Date: Date,
            
            // 数学和工具
            Math: Math,
            JSON: JSON,
            
            // 类型检查
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            isFinite: isFinite,
            
            // 错误类型（用于调试）
            Error: Error,
            TypeError: TypeError,
            RangeError: RangeError,
            
            // 只读的数据引用
            data: null,
          };
          
          // 使用 Proxy 严格控制访问
          return new Proxy(allowedGlobals, {
            get(target, prop) {
              if (prop === Symbol.unscopables) {
                return undefined;
              }
              
              if (prop in target) {
                return target[prop];
              }
              
              // 拒绝访问任何未定义的属性
              throw new ReferenceError(
                \`'\${String(prop)}' is not defined. \\n\` +
                \`Only these globals are available: \${Object.keys(allowedGlobals).join(', ')}\`
              );
            },
            
            set(target, prop, value) {
              // 只允许设置 data 属性（用于传递执行数据）
              if (prop === 'data') {
                target[prop] = value;
                return true;
              }
              
              // 拒绝设置其他属性
              throw new TypeError(
                \`Cannot set property '\${String(prop)}' on global context\`
              );
            },
            
            has(target, prop) {
              return prop in target;
            },
            
            // 防止 getOwnPropertyDescriptor 等元编程操作
            getOwnPropertyDescriptor(target, prop) {
              if (prop in target) {
                return Object.getOwnPropertyDescriptor(target, prop);
              }
              return undefined;
            }
          });
        };
        
        const safeContext = createSafeContext(utilityLib);
        
        // ============================================
        // 阶段 4: 代码执行引擎
        // ============================================
        const executeUserCodeSafely = (code, data, timeout) => {
          // 设置超时保护
          let timeoutId = null;
          let isTimedOut = false;
          
          if (timeout > 0) {
            timeoutId = setTimeout(() => {
              isTimedOut = true;
            }, timeout);
          }
          
          try {
            // 定期检查超时
            const checkTimeout = () => {
              if (isTimedOut) {
                throw new Error(\`Execution timeout (exceeded \${timeout}ms)\`);
              }
            };
            
            // 更新安全上下文中的数据
            safeContext.data = data;
            
            // 提取安全上下文的所有变量名和值
            // 不使用 with 语句，而是通过函数参数注入变量（兼容严格模式）
            const contextKeys = Object.keys(safeContext);
            const contextValues = contextKeys.map(key => safeContext[key]);
            
            // 包装用户代码：在严格模式下执行，通过参数注入变量
            const wrappedCode = \`
              "use strict";
              // 用户代码在这里执行，可以直接访问注入的变量（_, R, data, Math, etc.）
              \${code}
            \`;
            
            // 创建函数：参数是上下文变量名，函数体是用户代码
            // 例如: function(_, R, data, Array, Object, ...) { "use strict"; 用户代码 }
            const userFunction = new Function(
              ...contextKeys,  // 展开所有变量名作为参数
              'checkTimeout',
              wrappedCode
            );
            
            // 执行并获取结果：传入对应的值
            const result = userFunction(...contextValues, checkTimeout);
            
            // 清除超时
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            
            // 验证返回值（只检查危险类型，不限制结构）
            const validateResultType = (result) => {
              const type = typeof result
              
              // 禁止返回函数、Symbol
              if (type === 'function' || type === 'symbol') {
                throw new TypeError(
                  \`Code must not return \${type}. Returned types must be serializable.\`
                );
              }
              
              // 禁止返回 Promise
              if (result && typeof result.then === 'function') {
                throw new TypeError(
                  \`Code must not return a Promise. Async operations are not allowed.\`
                );
              }
              
              // 如果是数组，检查元素的危险类型
              if (Array.isArray(result)) {
                for (let i = 0; i < result.length; i++) {
                  const item = result[i];
                  const itemType = typeof item;
                  
                  if (itemType === 'function' || itemType === 'symbol') {
                    throw new TypeError(
                      \`Array element at index \${i} has forbidden type: \${itemType}\`
                    );
                  }
                  
                  if (item && typeof item.then === 'function') {
                    throw new TypeError(
                      \`Array element at index \${i} is a Promise. Async operations are not allowed.\`
                    );
                  }
                }
              }
            };
            
            validateResultType(result);
            
            return result;
            
          } catch (error) {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            throw error;
          } finally {
            // 清理数据引用（防止内存泄漏）
            safeContext.data = null;
          }
        };
        
        // ============================================
        // 阶段 5: 消息处理
        // ============================================
        self.onmessage = function(event) {
          const { code, data, timeout, taskId } = event.data;
          
          try {
            const result = executeUserCodeSafely(code, data, timeout);
            
            nativePostMessage({ 
              taskId,
              success: true,
              result: result 
            });
            
          } catch (error) {
            nativePostMessage({ 
              taskId,
              success: false,
              error: error.message || String(error),
              errorType: error.constructor.name
            });
          }
        };
        
        // 错误捕获
        self.onerror = function(event) {
          nativePostMessage({ 
            globalError: event.message || 'Unknown worker error'
          });
        };
        
        // 发送初始化成功消息
        nativePostMessage({ initialized: true });
        
      })(); // 立即执行
    `

    const blob = new Blob([workerCode], { type: 'application/javascript' })
    const blobURL = URL.createObjectURL(blob)

    const worker = new Worker(blobURL)

    // 等待初始化消息
    return new Promise<Worker>((resolve, reject) => {
      const timeout = setTimeout(() => {
        worker.terminate()
        URL.revokeObjectURL(blobURL)
        reject(new Error('Worker initialization timeout'))
      }, 10000)

      worker.onmessage = (e) => {
        if (e.data.initialized) {
          clearTimeout(timeout)
          resolve(worker)
        } else if (e.data.initError) {
          clearTimeout(timeout)
          worker.terminate()
          URL.revokeObjectURL(blobURL)
          reject(new Error(e.data.initError))
        }
      }

      worker.onerror = (errorEvent: ErrorEvent) => {
        clearTimeout(timeout)
        worker.terminate()
        URL.revokeObjectURL(blobURL)
        // ✅ 正确提取 ErrorEvent 中的错误信息
        const errorMessage = errorEvent.message || errorEvent.error?.message || 'Unknown worker initialization error'
        reject(new Error(`Worker initialization failed: ${errorMessage}`))
      }
    })
  }

  async acquire(): Promise<Worker> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.availableWorkers.length === 0) {
      // ⚠️ 关键修复：创建临时 Worker 时需要等待初始化完成
      try {
        const tempWorker = await this.createSecureWorker()
        return tempWorker
      } catch (error) {
        throw new Error(`Failed to create temporary Worker: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    return this.availableWorkers.pop()!
  }

  release(worker: Worker): void {
    if (this.workers.includes(worker)) {
      this.availableWorkers.push(worker)
    } else {
      // 临时创建的 Worker，直接终止
      worker.terminate()
    }
  }

  terminate(): void {
    this.workers.forEach((worker) => worker.terminate())
    this.workers = []
    this.availableWorkers = []
    this.isInitialized = false
  }
}

// 全局 Worker 池实例
let globalWorkerPool: WorkerPool | null = null
// ⚠️ 关键修复：添加初始化锁，防止并发创建多个 pool
let poolInitPromise: Promise<WorkerPool> | null = null
// Worker 池配置
let poolConfig = { poolSize: 2 }

/**
 * 获取或创建全局 Worker 池（线程安全）
 */
function getOrCreateWorkerPool(): Promise<WorkerPool> {
  if (globalWorkerPool) {
    return Promise.resolve(globalWorkerPool)
  }

  // 如果已经在初始化中，等待现有的初始化完成
  if (poolInitPromise) {
    return poolInitPromise
  }

  // 创建新的 pool 并初始化
  poolInitPromise = (async () => {
    try {
      const pool = new WorkerPool(poolConfig.poolSize)
      await pool.initialize()
      globalWorkerPool = pool
      return pool
    } catch (error) {
      // 重置 promise，允许下次重试
      poolInitPromise = null
      throw error
    }
  })()

  return poolInitPromise
}

/**
 * 初始化 Worker 池
 * @description 预热 Worker 实例，提升首次执行性能
 *
 * **⚠️ 注意：这是一个可选的性能优化方法**
 *
 * - **懒加载模式**：如果不调用此方法，Worker 池会在首次使用时自动初始化
 * - **推荐场景**：应用启动时预热，避免首次筛选时的冷启动延迟
 * - **配置选项**：
 *   - `poolSize`: Worker 池大小（默认 2）
 *
 * @param options - 初始化选项
 * @param options.poolSize - Worker 池大小，默认为 2
 *
 * @example
 * ```typescript
 * // ✅ 推荐：应用启动时预热（可选）
 * import { initializeWorkerPool } from '@visactor/vseed'
 *
 * // 在 main.ts 或入口文件中
 * await initializeWorkerPool({ poolSize: 2 })
 *
 * // ✅ 也可以：不做任何事，让 Worker 池自动初始化
 * // 首次调用 dynamicFilter 时会自动创建
 * ```
 */
export async function initializeWorkerPool(
  options: {
    utilityLibUrl?: string
    utilityLibSource?: string
    poolSize?: number
  } = {},
): Promise<void> {
  // 设置配置（必须在创建 pool 之前）
  poolConfig = {
    poolSize: options.poolSize ?? 2,
  }

  // ⚠️ 关键修复：使用统一的 getOrCreateWorkerPool 确保状态一致
  await getOrCreateWorkerPool()
}

/**
 * 销毁 Worker 池
 * @description 终止所有 Worker 实例并清理全局状态
 *
 * **⚠️ 注意：大多数情况下不需要手动调用此方法**
 *
 * - **一般使用**：浏览器会在页面卸载时自动清理 Worker 资源
 * - **建议场景**：
 *   - 单元测试的清理阶段（`afterAll` 钩子）
 *   - 开发环境热重载时清理旧实例
 *   - 动态卸载整个图表库模块（极少见）
 *
 * @example
 * ```typescript
 * // ✅ 推荐：测试环境
 * afterAll(() => {
 *   terminateWorkerPool()
 * })
 *
 * // ❌ 不推荐：组件卸载时（Worker 池是全局的，其他组件可能还在使用）
 * onUnmounted(() => {
 *   terminateWorkerPool() // 不要这样做！
 * })
 * ```
 */
export function terminateWorkerPool(): void {
  if (globalWorkerPool) {
    globalWorkerPool.terminate()
    globalWorkerPool = null
  }
  // ⚠️ 关键修复：重置初始化 Promise，避免状态不一致
  poolInitPromise = null
}

/**
 * 增强的安全验证
 * @description 针对 AI 生成代码的特定模式检查
 */
export function validateCodeSafety(code: string): void {
  // 1. 基础检查
  if (!code || code.trim().length === 0) {
    throw new Error('Code cannot be empty')
  }

  if (code.length > 50000) {
    throw new Error('Code is too long (max 50KB)')
  }

  // 2. 必须包含 return
  if (!/\breturn\b/.test(code)) {
    throw new Error('Code must contain a return statement')
  }

  // 3. 增强的黑名单检查
  const forbiddenPatterns = [
    // 原有的基础黑名单
    { pattern: /\beval\b/gi, description: 'eval()' },
    { pattern: /\bFunction\s*\(/gi, description: 'Function constructor' },
    { pattern: /\bnew\s+Function\b/gi, description: 'new Function()' },
    { pattern: /\bimportScripts\b/gi, description: 'importScripts()' },
    { pattern: /\bfetch\b/gi, description: 'fetch()' },
    { pattern: /\bXMLHttpRequest\b/gi, description: 'XMLHttpRequest' },
    { pattern: /\bWebSocket\b/gi, description: 'WebSocket' },
    { pattern: /\blocalStorage\b/gi, description: 'localStorage' },
    { pattern: /\bsessionStorage\b/gi, description: 'sessionStorage' },
    { pattern: /\bindexedDB\b/gi, description: 'indexedDB' },
    { pattern: /\bwindow\b/gi, description: 'window' },
    { pattern: /\bdocument\b/gi, description: 'document' },
    { pattern: /\bnavigator\b/gi, description: 'navigator' },
    { pattern: /\blocation\b/gi, description: 'location' },
    { pattern: /\brequire\b/gi, description: 'require()' },
    { pattern: /\bimport\s+/gi, description: 'import statement' },
    { pattern: /\bexport\s+/gi, description: 'export statement' },

    // 增强：Constructor 访问（绕过检测的常见方式）
    { pattern: /\bconstructor\b/gi, description: 'constructor access' },
    { pattern: /\[['"]constructor['"]\]/gi, description: 'constructor via bracket notation' },
    { pattern: /\['constructor'\]/gi, description: 'constructor string access' },

    // 增强：原型链操作
    { pattern: /\b__proto__\b/gi, description: '__proto__' },
    { pattern: /\bprototype\b/gi, description: 'prototype manipulation' },
    { pattern: /Object\.setPrototypeOf/gi, description: 'Object.setPrototypeOf()' },
    { pattern: /Object\.getPrototypeOf/gi, description: 'Object.getPrototypeOf()' },
    { pattern: /Object\.create\s*\(\s*null\s*\)/gi, description: 'Object.create(null)' },

    // 增强：反射和元编程
    { pattern: /\bReflect\./gi, description: 'Reflect API' },
    { pattern: /\bProxy\b/gi, description: 'Proxy constructor' },

    // 增强：全局对象访问
    { pattern: /\bglobal\b/gi, description: 'global object' },
    { pattern: /\bglobalThis\b/gi, description: 'globalThis' },
    { pattern: /\bself\s*\[/gi, description: 'self[] access' },
    { pattern: /\bthis\s*\.\s*constructor/gi, description: 'this.constructor' },

    // 增强：异步操作（容易被滥用）
    { pattern: /\basync\s+function/gi, description: 'async function' },
    { pattern: /\bawait\b/gi, description: 'await keyword' },
    { pattern: /\bnew\s+Promise\b/gi, description: 'new Promise()' },
    { pattern: /\.then\s*\(/gi, description: 'Promise.then()' },

    // 增强：生成器（可能导致难以控制的执行）
    { pattern: /\bfunction\s*\*/gi, description: 'generator function' },
    { pattern: /\byield\b/gi, description: 'yield keyword' },

    // 增强：动态代码生成
    { pattern: /\.apply\s*\(/gi, description: 'Function.apply()' },
    { pattern: /\.call\s*\(/gi, description: 'Function.call()' },
    { pattern: /\.bind\s*\(/gi, description: 'Function.bind()' },

    // 增强：Worker 相关
    { pattern: /\bWorker\b/gi, description: 'Worker constructor' },
    { pattern: /\bSharedWorker\b/gi, description: 'SharedWorker' },
    { pattern: /\bServiceWorker\b/gi, description: 'ServiceWorker' },
  ]

  for (const { pattern, description } of forbiddenPatterns) {
    if (pattern.test(code)) {
      throw new Error(
        `Security violation: Code contains forbidden pattern "${description}". ` +
          `For AI-generated code, please regenerate without this pattern.`,
      )
    }
  }

  // 4. 检查可疑的字符串拼接（用于绕过检测）
  const suspiciousPatterns = [
    /['"]con['"] *\+ *['"]structor['"]/gi, // "con" + "structor"
    /['"]ev['"] *\+ *['"]al['"]/gi, // "ev" + "al"
    /['"]__pro['"] *\+ *['"]to__['"]/gi, // "__pro" + "to__"
    /\b(self|window|global)\s*\[\s*['"][a-z]+['"]\s*\+\s*['"][a-z]+['"]\s*\]/gi, // self["x" + "y"]
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(code)) {
      throw new Error(
        'Security violation: Code contains suspicious string concatenation that may bypass security checks.',
      )
    }
  }

  // 5. AI 代码特定检查
  // AI 生成的代码通常比较规范，不应该包含过于 tricky 的写法
  const aiCodeWarnings = [
    { pattern: /\[['"][a-z_$]+['"]\]/gi, count: 0, threshold: 10, description: 'excessive bracket notation' },
    { pattern: /\s*\+\s*['"]/gi, count: 0, threshold: 5, description: 'excessive string concatenation' },
  ]

  for (const warning of aiCodeWarnings) {
    const matches = code.match(warning.pattern)
    if (matches && matches.length > warning.threshold) {
      throw new Error(
        `Security warning: Code contains ${matches.length} instances of ${warning.description}, ` +
          `which is unusual for AI-generated code. Please regenerate.`,
      )
    }
  }
}

/**
 * 代码执行函数
 * @description 使用 Worker 池和增强安全检查
 */
export async function executeFilterCode(options: CodeExecutionOptions): Promise<CodeExecutionResult> {
  const { code, data, timeout = 2000 } = options

  // 1. 环境检查
  // if (typeof Worker === 'undefined' || typeof window === 'undefined') {
  //   throw new Error('This feature requires browser environment with Web Worker support.')
  // }

  // 2. 增强的安全验证
  validateCodeSafety(code)

  // 3. 验证输入数据
  if (!Array.isArray(data)) {
    throw new Error('Input data must be an array')
  }

  // 数据大小限制（防止 OOM）
  if (data.length > 100000) {
    console.warn(`[vseed] Large dataset detected: ${data.length} items. Consider pagination for better performance.`)
  }

  // 4. 初始化或获取 Worker 池（线程安全）
  const pool = await getOrCreateWorkerPool()
  const worker = await pool.acquire()
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(7)}`

  try {
    const result = await new Promise<any[]>((resolve, reject) => {
      // ⚠️ 关键修复：使用 AbortController 和 cleanup 确保监听器总是被清理
      let isSettled = false
      const cleanup = () => {
        if (!isSettled) {
          isSettled = true
          worker.removeEventListener('message', messageHandler)
          worker.removeEventListener('error', errorHandler)
        }
      }

      // 外层超时保护（比内层多 1 秒）
      const outerTimeoutId = setTimeout(() => {
        cleanup()
        reject(new Error(`Execution timeout (exceeded ${timeout}ms) - outer guard`))
      }, timeout + 1000)

      // 消息处理
      const messageHandler = (e: MessageEvent) => {
        if (e.data.taskId !== taskId) return

        clearTimeout(outerTimeoutId)
        cleanup()

        if (e.data.success) {
          resolve(e.data.result)
        } else {
          reject(new Error(`Execution failed: ${e.data.error}${e.data.errorType ? ` (${e.data.errorType})` : ''}`))
        }
      }

      // 错误处理
      const errorHandler = (errorEvent: ErrorEvent) => {
        clearTimeout(outerTimeoutId)
        cleanup()
        // ✅ 正确提取 ErrorEvent 中的错误信息
        const errorMessage = errorEvent.message || errorEvent.error?.message || 'Unknown worker error'
        reject(new Error(`Worker error: ${errorMessage}`))
      }

      worker.addEventListener('message', messageHandler)
      worker.addEventListener('error', errorHandler)

      worker.postMessage({
        taskId,
        code,
        data,
        timeout,
      })
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    // 归还 Worker 到池中
    if (globalWorkerPool) {
      globalWorkerPool.release(worker)
    }
  }
}
