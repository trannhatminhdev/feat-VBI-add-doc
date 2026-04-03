# 7. Connector 系统（拓展了解）

> 本节为拓展内容。Connector 是 VBI 取数的底层机制，AI 通常不需要直接操作，了解即可。

## 7.1 注册 Connector

> ⚠️ `VBI.registerConnector()` 不在 `@visactor/vbi` 主入口导出。参考 `practices/standard/src/utils/demoConnector.ts` 的实际使用方式。

```ts
// ⚠️ 需要通过 standard practice 间接使用
import { VBI } from '@visactor/vbi';

VBI.registerConnector('my-connector-id', async () => {
  return {
    discoverSchema: async () => [...],
    query: async ({ queryDSL, schema, connectorId, signal }) => {
      return { dataset: [...] };
    },
  };
});
```

## 7.2 VBIConnector 接口

```ts
interface VBIConnector {
  // 返回数据源的字段列表（name + type）
  discoverSchema(): Promise<Array<{ name: string; type: string }>>

  // 执行查询，返回数据集
  query(props: {
    queryDSL: VQueryDSL // 生成的 SQL DSL
    schema: SchemaField[] // discoverSchema 返回的结构
    connectorId: string
    signal?: AbortSignal // 可选的中断信号
  }): Promise<{
    dataset: Array<Record<string, number | string | boolean | null>>
  }>
}
```

## 7.3 标准 Connector 示例

参考 `practices/standard/src/utils/demoConnector.ts`：

```ts
import { VBI } from '@visactor/vbi'
import { VQuery, type DatasetColumn, type RawDatasetSource, type VQueryDSL } from '@visactor/vquery'

export const registerDemoConnector = () => {
  const vquery = new VQuery()

  VBI.registerConnector('demo', async () => {
    return {
      discoverSchema: async () => [
        { name: 'order_date', type: 'date' },
        { name: 'category', type: 'string' },
        { name: 'region', type: 'string' },
        { name: 'sales', type: 'number' },
        { name: 'profit', type: 'number' },
      ],
      query: async ({ queryDSL, schema }) => {
        if (!(await vquery.hasDataset('demo'))) {
          await vquery.createDataset(
            'demo',
            schema as DatasetColumn[],
            { type: 'csv', rawDataset: 'https://visactor.github.io/VBI/dataset/supermarket.csv' } as RawDatasetSource,
          )
        }
        const dataset = await vquery.connectDataset('demo')
        const result = await dataset.query(queryDSL as VQueryDSL<Record<string, string | number>>)
        return { dataset: result.dataset }
      },
    }
  })

  return 'demo'
}
```
