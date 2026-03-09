### Sort

排序配置，用于控制维度值的排序方式

```typescript
export type Sort = {
  /**
   * @description 排序顺序, 可选值为 'asc' 或 'desc'
   * @enum ['asc', 'desc']
   * @example order:'asc'
   */
  order?: 'asc' | 'desc'

  /**
   * @description 排序依赖的字段, 可以是维度id或指标id
   * @example
   * - orderBy:'date'
   * - orderBy:'profit'
   */
  orderBy?: string

  /**
   * @description 自定义排序顺序, 该顺序将直接应用至类目轴
   */
  customOrder?: string[]
}
```
