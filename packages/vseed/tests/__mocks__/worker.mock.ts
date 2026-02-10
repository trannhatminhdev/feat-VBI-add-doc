/**
 * Web Worker Mock for Testing
 * @description 模拟 Worker 行为，用于单元测试
 */

export class WorkerMock {
  private listeners: Array<(event: MessageEvent) => void> = []
  private errorListeners: Array<(event: ErrorEvent) => void> = []
  private workerCode: string = ''
  private initialized: boolean = false
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  
  constructor(scriptURL: string | URL) {
    // 在 mock 环境中，scriptURL 是 Blob URL，我们无法直接获取其内容
    // 但我们可以在 postMessage 时执行代码
    this.workerCode = scriptURL.toString()
    
    // 发送初始化消息（使用 onmessage 或 listeners）
    setTimeout(() => {
      this.sendInitMessage()
    }, 0)
  }
  
  private sendInitMessage(): void {
    if (this.initialized) return
    this.initialized = true
    
    const message = new MessageEvent('message', { 
      data: { initialized: true } 
    })
    
    if (this.onmessage) {
      this.onmessage(message)
    }
    this.listeners.forEach(listener => listener(message))
  }
  
  // 模拟 Worker 的 postMessage
  postMessage(messageData: any): void {
    // 异步执行，模拟真实 Worker 行为
    setTimeout(async () => {
      const { taskId, code, data: inputData } = messageData
      
      try {
        // 动态加载内置工具库 (使用 import 代替 require)
        const { BUILTIN_UTILS_SOURCE } = await import('../../src/pipeline/utils/sandbox/builtin-utils.js')
        
        // 创建工具库上下文
        const utilsContext = {}
        const utilsFunction = new Function('self', BUILTIN_UTILS_SOURCE + '; return { _: self._, R: self.R };')
        const { _, R } = utilsFunction(utilsContext)
        
        // 执行用户代码
        const fn = new Function('data', '_', 'R', code)
        const result = fn(inputData, _, R)
        
        // 验证返回值（支持多种类型）
        // - 数组（TableDynamicFilter 或 ChartDynamicFilter）
        // - 数值或字符串（ValueDynamicFilter）
        const validateResultType = (result: any) => {
          const type = typeof result
          
          // 禁止返回函数、Symbol
          if (type === 'function' || type === 'symbol') {
            throw new TypeError(
              `Code must not return ${type}. Returned types must be serializable.`
            )
          }
          
          // 禁止返回 Promise
          if (result && typeof result.then === 'function') {
            throw new TypeError(
              `Code must not return a Promise. Async operations are not allowed.`
            )
          }
          
          // 如果是数组，检查元素的危险类型
          if (Array.isArray(result)) {
            for (let i = 0; i < result.length; i++) {
              const item = result[i]
              const itemType = typeof item
              
              if (itemType === 'function' || itemType === 'symbol') {
                throw new TypeError(
                  `Array element at index ${i} has forbidden type: ${itemType}`
                )
              }
              
              if (item && typeof item.then === 'function') {
                throw new TypeError(
                  `Array element at index ${i} is a Promise. Async operations are not allowed.`
                )
              }
            }
          }
        }
        
        validateResultType(result)
        
        // 返回成功结果
        const message = new MessageEvent('message', { 
          data: { 
            taskId,
            success: true, 
            result 
          } 
        })
        
        if (this.onmessage) {
          this.onmessage(message)
        }
        this.listeners.forEach(listener => listener(message))
      } catch (error: any) {
        // 返回错误
        const message = new MessageEvent('message', { 
          data: { 
            taskId,
            success: false, 
            error: error.message,
            errorType: error.constructor.name
          } 
        })
        
        if (this.onmessage) {
          this.onmessage(message)
        }
        this.listeners.forEach(listener => listener(message))
      }
    }, 0)
  }
  
  // 模拟 Worker 的 addEventListener
  addEventListener(type: string, listener: any): void {
    if (type === 'message') {
      this.listeners.push(listener)
    } else if (type === 'error') {
      this.errorListeners.push(listener)
    }
  }
  
  // 模拟 Worker 的 removeEventListener
  removeEventListener(type: string, listener: any): void {
    if (type === 'message') {
      const index = this.listeners.indexOf(listener)
      if (index > -1) this.listeners.splice(index, 1)
    } else if (type === 'error') {
      const index = this.errorListeners.indexOf(listener)
      if (index > -1) this.errorListeners.splice(index, 1)
    }
  }
  
  // 模拟 Worker 的 terminate
  terminate(): void {
    this.listeners = []
    this.errorListeners = []
  }
  
  // 辅助方法：触发消息（用于测试）
  _triggerMessage(data: any): void {
    const event = new MessageEvent('message', { data })
    this.listeners.forEach(listener => listener(event))
  }
  
  // 辅助方法：触发错误（用于测试）
  _triggerError(error: Error): void {
    const event = new ErrorEvent('error', { error, message: error.message })
    this.errorListeners.forEach(listener => listener(event))
  }
}

// 全局 Worker Mock 工厂
export function mockWorker(): typeof Worker {
  return WorkerMock as any
}

