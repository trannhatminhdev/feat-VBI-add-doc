# 执行计划: VBI Measure 数值格式支持

> 基于 ADR: `./adr.md`
> TDD 驱动: 先写测试 → 再实现 → 全部测试通过

## 范围

本计划聚焦 VBI 核心包（`packages/vbi`），不含 `practices/demo` UI 改造。

## Phase 1: 类型定义

### 1.1 新增 VBIMeasureFormat 类型

**改动文件**: `packages/vbi/src/types/dsl/measures/measures.ts`

改动内容:

1. 从 `@visactor/vseed` 引入 `NumFormat`
2. 新增类型: `VBIMeasureFormat = { autoFormat: true } | ({ autoFormat?: false } & NumFormat)`
3. 在 `zVBIMeasure` 中新增可选字段 `format`
4. 对应 Zod schema: `zVBIMeasureFormat`

### 1.2 导出类型

**改动文件**: `packages/vbi/src/types/dsl/index.ts`

改动内容:

- 新增导出 `VBIMeasureFormat`

## Phase 2: Builder 扩展（先写测试）

### 2.1 先写测试

**测试文件**: `packages/vbi/tests/builder/features/measures.test.ts`（追加）

测试内容:

1. `MeasureNodeBuilder.setFormat({ autoFormat: true })` 正确存储
2. `MeasureNodeBuilder.setFormat(customFormat)` 正确存储自定义格式
3. `MeasureNodeBuilder.getFormat()` 返回当前 format 或 undefined
4. `MeasureNodeBuilder.clearFormat()` 清除格式配置
5. `setFormat` 后 `toJSON()` 包含 `format` 字段
6. `clearFormat` 后 `toJSON()` 不含 `format` 字段
7. 未设置 format 时，`getFormat()` 返回 undefined

### 2.2 实现 Builder

**改动文件**: `packages/vbi/src/builder/features/measures/mea-node-builder.ts`

改动内容:

- 新增 `setFormat(format: VBIMeasureFormat): this`
- 新增 `getFormat(): VBIMeasureFormat | undefined`
- 新增 `clearFormat(): this`

## Phase 3: buildVSeed 适配（先写测试）

### 3.1 先写测试

**测试文件**: `packages/vbi/tests/builder/features/measures.test.ts`（追加 buildVSeed 测试）

测试内容:

1. `format: { autoFormat: true }` → VSeed measure 含 `autoFormat: true`，不含 `numFormat`
2. `format: customFormat` → VSeed measure 含 `autoFormat: false` + `numFormat: customFormat`
3. `format` 未设置 → VSeed measure 不含 `autoFormat`，不含 `numFormat`

### 3.2 实现适配

**改动文件**: `packages/vbi/src/builder/adapters/vquery-vseed/build-vseed.ts`

改动内容:

- 在 measure 映射中增加 format → autoFormat / numFormat 的转换逻辑

## Phase 4: 验证

```bash
pnpm --filter=@visactor/vbi run test
pnpm run lint
pnpm run typecheck
```

全部通过才算完成。

## 执行顺序

| 步骤 | 动作                                | 文件                                                |
| ---- | ----------------------------------- | --------------------------------------------------- |
| 1    | 实现 VBIMeasureFormat 类型 + schema | `src/types/dsl/measures/measures.ts`                |
| 2    | 更新类型导出                        | `src/types/dsl/index.ts`                            |
| 3    | 写 builder 测试                     | `tests/builder/features/measures.test.ts`           |
| 4    | 实现 builder 方法                   | `src/builder/features/measures/mea-node-builder.ts` |
| 5    | 运行 builder 测试                   | 验证通过                                            |
| 6    | 写 buildVSeed 测试                  | `tests/builder/features/measures.test.ts`           |
| 7    | 实现 buildVSeed 适配                | `src/builder/adapters/vquery-vseed/build-vseed.ts`  |
| 8    | 运行 buildVSeed 测试                | 验证通过                                            |
| 9    | 全量验证                            | `test + lint + typecheck`                           |
