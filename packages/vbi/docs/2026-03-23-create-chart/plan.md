# 执行计划: VBI createChart 与 Chart 命名收敛

> 基于 ADR: `./adr.md`
> 策略: 先写测试锁定新 API，再做兼容式重命名；首期优先改 symbol 和 export，不做大规模目录搬迁

## 范围

本计划只覆盖 `packages/vbi`，包含 `createChart` 主入口、`VBIChartBuilder` / `VBIChartDSL` 命名统一、deprecated alias、测试与生成物更新；不包含 `createReport` 实现、不改变 chart DSL 运行时字段结构，也不重命名 `MeasuresBuilder` / `DimensionsBuilder` 等 feature builder。

## Phase 1: 先锁定对外 API 行为

### 1.1 补 public API 测试

**改动文件**: `packages/vbi/tests/builder/builder.test.ts`
测试内容:

1. `VBI.createChart(vbiChart)` 的行为与当前 `VBI.from(vbi)` 一致
2. `createVBI(...).createChart(...)` 正确继承和覆盖默认 `builderOptions`
3. `VBI.from(...)` / `VBI.create(...)` 仍可用，但只是 `createChart(...)` 的 alias
4. `VBI.generateEmptyChartDSL(...)` 与旧的 `generateEmptyDSL(...)` 产物一致

### 1.2 补 root schema 测试

**改动文件**: `packages/vbi/tests/types/runtimeSchemas.test.ts`
测试内容:

1. `zVBIChartDSL` 能正确 parse 完整 chart DSL
2. `zVBIDSL` 作为 alias 仍可 parse 相同输入
3. 运行时测试和示例代码默认改用新名字

## Phase 2: 根 DSL 命名收敛

**改动文件**:

- `packages/vbi/src/types/dsl/vbi/vbi.ts`
- `packages/vbi/src/types/dsl/index.ts`
- `packages/vbi/src/types/index.ts`
- `packages/vbi/src/vbi/generate-empty-dsl.ts`
- `packages/vbi/src/builder/modules/build.ts`
- `packages/vbi/src/builder/modules/is-empty.ts`
- `packages/vbi/src/builder/modules/index.ts`
  改动内容:

1. 导出 `VBIChartDSL`、`VBIChartDSLInput`、`zVBIChartDSL`
2. 保留 `VBIDSL`、`VBIDSLInput`、`zVBIDSL` 作为 deprecated alias
3. 新增 `generateEmptyChartDSL`、`buildVBIChartDSL`、`isEmptyVBIChartDSL`
4. 内部实现优先切到新名字，旧名字只保留在兼容层

## Phase 3: Builder 与 adapter 类型收敛

**改动文件**:

- `packages/vbi/src/builder/builder.ts`
- `packages/vbi/src/builder/index.ts`
- `packages/vbi/src/types/builder/VBIInterface.ts`
- `packages/vbi/src/types/builder/adapter.ts`
- `packages/vbi/src/types/builder/index.ts`
- `packages/vbi/src/pipeline/vqueryDSL/index.ts`
- `packages/vbi/src/pipeline/vqueryDSL/types.ts`
  改动内容:

1. `VBIBuilder` 改为 `VBIChartBuilder`
2. `VBIBuilderInterface` / `VBIBuilderOptions` / `VBIBuilderAdapters` 改为 `VBIChart*`
3. `VBIBuildVQueryContext` / `VBIBuildVSeedContext` / `VBIQueryBuilder` / `VBISeedBuilder` 同步改为 `VBIChart*`
4. 旧 builder 类型名保留 deprecated alias
5. `MeasuresBuilder`、`DimensionsBuilder`、`ChartTypeBuilder` 等 feature builder 名称保持不变

## Phase 4: 根入口切到 `createChart`

**改动文件**:

- `packages/vbi/src/vbi/create-vbi.ts`
- `packages/vbi/src/vbi/from/from-vbi-dsl-input.ts`
- `packages/vbi/src/vbi.ts`
- `packages/vbi/src/index.ts`
  改动内容:

1. `createVBI()` 返回的实例接口新增 `createChart(...)`
2. `from(...)` / `create(...)` 统一委托到 `createChart(...)`
3. `generateEmptyDSL` 对外改为 `generateEmptyChartDSL`，旧名保留 alias
4. `src/index.ts` 对外导出顺序改为“新名字在前，旧 alias 在后”

## Phase 5: 包内消费方迁移

**改动范围**:

- `packages/vbi/tests/**/*.ts`
- `packages/vbi/tests/examples/**/*.ts`
- `packages/vbi/tests/examples/**/*.json`
- `packages/vbi/src/**/*.ts`
  改动内容:

1. 包内源码默认改用 `VBIChartDSL`、`VBIChartBuilder`、`createChart(...)`
2. 单测默认改用新 API，只保留少量兼容用例覆盖旧 alias
3. examples 里的 `VBIBuilder` 代码片段统一改为 `VBIChartBuilder`
4. 检查是否有遗漏的 `VBIDSL` / `VBI.from` / `generateEmptyDSL` 直接引用
   说明:
   首期不做 `builder/`、`types/builder/`、`vbi/from/` 的物理目录大搬迁；先完成 symbol 收敛和兼容层，等 `reportBuilder` 落地时再评估目录重组，避免无意义 churn。

## Phase 6: 生成物与验证

**命令**:

```bash
pnpm --filter=@visactor/vbi run g
pnpm --filter=@visactor/vbi run test
pnpm run lint
pnpm run typecheck
```

验收标准:

1. 新文档、测试、examples 默认只展示 `createChart` / `VBIChartBuilder` / `VBIChartDSL`
2. 旧 alias 仍能通过编译和关键兼容测试
3. 生成物 diff 只反映命名收敛，不引入额外运行时行为变化

## 执行顺序

| 步骤 | 动作                                     | 文件                                             |
| ---- | ---------------------------------------- | ------------------------------------------------ |
| 1    | 写 `createChart` / alias 测试            | `tests/builder/builder.test.ts`                  |
| 2    | 写 `zVBIChartDSL` / alias 测试           | `tests/types/runtimeSchemas.test.ts`             |
| 3    | 实现根 DSL 新名字 + alias                | `src/types/dsl/vbi/vbi.ts` 等                    |
| 4    | 实现 `VBIChartBuilder` 系列类型          | `src/builder/builder.ts` + `src/types/builder/*` |
| 5    | 实现 `createChart` 根入口                | `src/vbi/create-vbi.ts` + `src/index.ts`         |
| 6    | 包内源码与测试切换到新名字               | `src/**` + `tests/**`                            |
| 7    | 运行 `pnpm --filter=@visactor/vbi run g` | 更新 examples / API / 快照                       |
| 8    | 全量验证                                 | `test + lint + typecheck`                        |
