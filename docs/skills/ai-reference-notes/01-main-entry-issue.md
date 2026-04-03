# 1. @visactor/vbi 主入口导出问题

## 重要说明

**每个 practice 都是独立项目**，有自己的 `demoConnector.ts`。下面的说明是通用的解决方法，适用于所有 practice。

## 问题描述

## 问题描述

`@visactor/vbi` 的主入口（`src/index.ts`）实际只导出了 3 个模块：

```ts
export * from './tree'
export { id } from './id'
export * from './filter-guards'
```

以下核心功能**存在但未从主入口导出**：

| 功能                                 | 实际位置                         | 说明                     |
| ------------------------------------ | -------------------------------- | ------------------------ |
| `VBI` / `VBI.createChart()`          | `src/vbi/create-vbi.ts`          | 需通过 standard 间接使用 |
| `VBIChartBuilder`                    | `src/chart-builder/builder.ts`   | 需通过 standard 间接使用 |
| `registerConnector` / `getConnector` | `src/chart-builder/connector.ts` | 需通过 standard 间接使用 |
| `generateEmptyChartDSL`              | `src/vbi/generate-empty-dsl.ts`  | 需通过 standard 间接使用 |
| 所有 DSL 类型（`VBIChartDSL` 等）    | `src/types/chartDSL/`            | 仅类型，间接使用         |
| 所有 Builder 类型                    | `src/types/builder/`             | 仅类型，间接使用         |
| 类型守卫 `isVBIFilter` 等            | `src/utils/filter-guards.ts`     | ✅ 主入口有导出          |

## 为什么每个 practice 都能用

每个 practice 的 `tsconfig.json` 配置了：

```json
{
  "moduleResolution": "bundler",
  "paths": { "src/*": ["./src/*"] }
}
```

`package.json` 中使用 `"workspace:*"` 引用包，加上 `moduleResolution: "bundler"` 允许 TypeScript 直接解析到源码文件，跳过了主入口的 `exports` 限制。这是 **monorepo 内部特权**，发布到 npm 后失效。

每个 practice 都用同样的方式解决：各自实现自己的 `demoConnector.ts`，封装 VBI API。

## @visactor/vseed 同样有问题

`@visactor/vseed` 的主入口（`src/index.ts`）也未导出渲染相关 API：

```ts
// 主入口只导出了这些：
export * from './chartType'
export * from './dataset'
// ... 共 19 个子模块

// 以下存在但未在主入口：
export { Builder }                      // 位于 src/builder/builder/
export function isVChart()              // 位于 src/pipeline/utils/chatType.ts
export function isPivotChart()          // 同上
export function isTable()               // 同上
export function isPivotTable()          // 同上
export type VSeed                      // 位于 src/types/vseed.ts
```

## 正确参考方式

直接使用**目标 practice** 自己的 `demoConnector.ts`：

```ts
// ✅ 正确：参考目标 practice 自己的 demoConnector.ts
import { defaultBuilder } from 'src/utils/demoConnector'

// ❌ 错误：VBI 不在主入口
import { VBI } from '@visactor/vbi'
```

## 源码位置

| 功能                      | 源码位置                                        |
| ------------------------- | ----------------------------------------------- |
| 主入口                    | `packages/vbi/src/index.ts`                     |
| VBI.createChart           | `packages/vbi/src/vbi/create-vbi.ts`            |
| VBIChartBuilder           | `packages/vbi/src/chart-builder/builder.ts`     |
| registerConnector         | `packages/vbi/src/chart-builder/connector.ts`   |
| generateEmptyChartDSL     | `packages/vbi/src/vbi/generate-empty-dsl.ts`    |
| filter-guards（主入口有） | `packages/vbi/src/utils/filter-guards.ts`       |
| vseed 主入口              | `packages/vseed/src/index.ts`                   |
| VSeedBuilder              | `packages/vseed/src/builder/builder/builder.ts` |
| isVChart 等               | `packages/vseed/src/pipeline/utils/chatType.ts` |
