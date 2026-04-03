# 17. Demo Connector — 连接器注册与 Builder 工厂

## 源码

- CSV URL 模式（推荐，最简洁）：`practices/streamlined/src/utils/demoConnector.ts`
- LocalConnector 模式（支持本地数据 + 类型规范化）：`practices/professional/src/utils/localConnector.ts`

## Connector 注册

每个 practice 需要独立实现自己的 Connector。Connector 提供：

- `discoverSchema`：返回字段列表（name + type）
- `query`：接收 VQueryDSL，执行查询，返回数据集

### 模式一：CSV URL（最简洁，推荐）

```ts
import { VBI } from '@visactor/vbi'
import { VQuery, type DatasetColumn, type RawDatasetSource, type VQueryDSL } from '@visactor/vquery'

export const connectorId = 'demo'

export const registerDemoConnector = () => {
  const vquery = new VQuery()

  VBI.registerConnector(connectorId, async () => {
    return {
      discoverSchema: async () => {
        return [
          { name: 'order_date', type: 'date' },
          { name: 'province', type: 'string' },
          { name: 'sales', type: 'number' },
          // ...其他字段
        ]
      },
      query: async ({ queryDSL, schema }) => {
        if (!(await vquery.hasDataset(connectorId))) {
          const url = 'https://visactor.github.io/VBI/dataset/supermarket.csv'
          const datasetSource = { type: 'csv', rawDataset: url }
          await vquery.createDataset(connectorId, schema as DatasetColumn[], datasetSource as RawDatasetSource)
        }
        const dataset = await vquery.connectDataset(connectorId)
        const queryResult = await dataset.query(queryDSL as VQueryDSL<Record<string, string | number>>)
        return { dataset: queryResult.dataset }
      },
    }
  })

  return connectorId
}

registerDemoConnector() // 模块加载时自动注册
```

## Builder 工厂

```ts
import { VBI } from '@visactor/vbi'

// 创建 builder 实例（使用 connectorId 关联 Connector）
export const createDefaultBuilder = () => {
  return VBI.createChart(VBI.generateEmptyChartDSL(connectorId))
}

// 预创建的默认 builder（单例，模块加载时创建）
export const defaultBuilder = VBI.createChart(VBI.generateEmptyChartDSL(connectorId))
```

## VBI.createChart — 创建 Builder

```ts
const builder = VBI.createChart(dsl: VBIChartDSL): VBIChartBuilder
```

参数是 VBIChartDSL 快照。`VBI.generateEmptyChartDSL(connectorId)` 生成空配置的 DSL：

```ts
const dsl = VBI.generateEmptyChartDSL(connectorId)
// dsl: { chartType: 'table', dimensions: [], measures: [], whereFilter: ..., connectorId: 'demo' }
```

## 数据流中的 Connector

```
用户配置（维度/度量/过滤）
  ↓ builder.buildVQuery()
  ↓ VQueryDSL（查询描述）
  ↓ Connector.query({ queryDSL, schema })
  ↓ 执行 SQL / API 查询
  ↓ 返回数据集
  ↓ builder.buildVSeed()（合并 DSL + 数据集）
  ↓ VSeed（渲染描述）
  ↓ VSeedRender（渲染为图表）
```

## 自定义 Connector

如需连接真实数据源，将 `discoverSchema` 和 `query` 实现替换为真实 API：

```ts
VBI.registerConnector('my-api', async () => {
  return {
    discoverSchema: async () => {
      const res = await fetch('/api/schema')
      return res.json()
    },
    query: async ({ queryDSL, schema }) => {
      const res = await fetch('/api/query', {
        method: 'POST',
        body: JSON.stringify(queryDSL),
      })
      return res.json()
    },
  }
})
```

## 注意事项

- **每个 practice 独立实现**自己的 demoConnector.ts，不跨 practice 引用
- 模块加载时自动调用 `registerXxxConnector()` 注册 Connector
- `VBI.registerConnector` 在模块级别调用安全，内部有幂等保护
- `connectorId` 需与 DSL 中的 `connectorId` 一致
- `createDefaultBuilder()` 可在 `VBIStoreProvider` 中传入，支持多 builder 实例
- **RawDatasetSource.rawDataset 类型约束**：当使用 `type: 'json'` 时，`rawDataset` 必须是 `TidyDatum[]`，即 `Record<string, number | string | null | boolean | undefined>[]`。不支持嵌套对象，需用 `toTidyDatum()` 转换。具体见 [19-ui-considerations.md](./19-ui-considerations.md) 第 5 节。
