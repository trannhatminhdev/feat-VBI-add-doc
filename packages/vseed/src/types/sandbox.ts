/**
 * 代码执行结果
 */
export interface CodeExecutionResult {
  success: boolean
  data: any // 支持多种返回类型：array | number | string
  error?: string
}

/**
 * 代码执行选项
 */
export interface CodeExecutionOptions {
  /** 执行代码 */
  code: string
  /** 输入数据 */
  data: any[]
  /** 超时时间（毫秒），默认 2000ms */
  timeout?: number
}
