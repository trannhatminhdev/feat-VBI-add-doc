# 3. 易遗漏的 API

## Y.Map / Yjs 原生方法

`builder.dsl` 是 `Y.Map<any>`，`builder.doc` 是 `Y.Doc`。虽然 docs/ai-reference/03-vbi-api.md 中已记录，但以下方法容易被忽略：

```ts
// Y.Map 读取
builder.dsl.get(path) // 例: builder.dsl.get('chartType') → 'bar'

// Y.Map 写入（嵌套结构）
builder.dsl.get(path).set(k, v) // 例: builder.dsl.get('chartType').set('alias', '柱状图')

// Y.Doc 事务操作（多个变更合并为一次 undo/redo）
builder.doc.transact(() => {
  builder.dimensions.add('category')
  builder.measures.add('sales', { aggregate: 'sum' })
})

// Y.Doc 事件监听
builder.doc.on('update', (update, origin) => {
  // 任意 Yjs 变更都会触发
})
builder.dsl.observe((event) => {
  /* Y.Map 变更事件 */
})
```

所有 standard hooks 内部都使用 `builder.doc.transact()` 封装操作，保证 undo/redo 正确性。AI 操作用 builder API 足够了，一般不需要直接用 transact。

## ChartType 编码查询

`chartType` 子 builder 提供查询方法，但这些方法**不在 Builder API 章节列出**：

```ts
// 查询当前图表类型支持的度量编码
builder.chartType.getSupportedMeasureEncodings(): Encoding[]

// 查询当前图表类型支持的维度编码
builder.chartType.getSupportedDimensionEncodings(): Encoding[]
```

## Node get 方法返回 undefined

在 DSL 查询和 node 回调中，以下方法当未设置时**返回 undefined**，而非空值：

```ts
// 获取节点编码配置（未设置时返回 undefined）
node.getEncoding(): Record<string, any> | undefined

// 获取节点排序配置（未设置时返回 undefined）
node.getSort(): VBISortSpec | undefined

// 获取节点格式化配置（未设置时返回 undefined）
node.getFormat(): VBIFormatSpec | undefined
```

## useFilterRootOperator 未导出

切换过滤根操作符（AND/OR）的 hook 位于 standard 组件目录，未对外导出：

```ts
// 位置：practices/standard/src/components/Shelves/hooks/useFilterRootOperator.ts
// 未在 practices/standard/src/hooks/index.ts 中导出
// 需要直接 import 该文件使用
import { useFilterRootOperator } from 'practices/standard/src/components/Shelves/hooks/useFilterRootOperator'
```
