# ADR-003: VBI Measure 数值格式支持

## Status

Proposed

## Context

VSeed 的 `Measure` 已支持数值格式相关配置：

- `autoFormat?: boolean`
- `numFormat?: NumFormat`

当前 VBI 还没有把这组能力完整接通到自己的 DSL、builder 和 `buildVSeed` 适配层；`practices/standard` 的 measure shelf 也还不能在 UI 上编辑格式配置。

本 ADR 的目标是将 measure format 能力以单一接口接入 VBI，并补齐到 Demo UI。

## Decision

### 1. VBI 对外统一为一个 `format` 接口

VBI 在 `VBIMeasure` 上新增：

```typescript
type VBIMeasureFormat = { autoFormat: true } | ({ autoFormat?: false } & NumFormat)

type VBIMeasure = {
  // ...existing fields
  format?: VBIMeasureFormat
}
```

含义约束：

1. `format: { autoFormat: true }` 表示启用自动格式
2. `format` 为其他对象时，表示自定义数值格式
3. `format` 未设置时，表示不显式指定格式，交由 VSeed 默认行为处理

VBI 不直接暴露 `autoFormat` 和 `numFormat` 这两个顶层 DSL 字段。

### 2. `MeasureNodeBuilder` 只提供一组 format 方法

`MeasureNodeBuilder` 新增：

```typescript
class MeasureNodeBuilder {
  setFormat(format: VBIMeasureFormat): this
  getFormat(): VBIMeasureFormat | undefined
  clearFormat(): this
}
```

行为约束：

1. `setFormat({ autoFormat: true })` 表示切换到自动格式
2. `setFormat(customFormat)` 表示切换到自定义格式
3. `clearFormat()` 删除格式配置，回到“未显式设置”的默认状态

推荐用法：

```typescript
builder.measures.add('sales', (node) => {
  node.setFormat({
    type: 'number',
    ratio: 10000,
    symbol: '万',
    prefix: '¥',
    fractionDigits: 2,
  })
})
```

或：

```typescript
builder.measures.add('sales', (node) => {
  node.setFormat({ autoFormat: true })
})
```

### 3. `MeasuresBuilder` 保持现状

`MeasuresBuilder` 不新增 format 专用便捷方法。

继续使用现有入口：

```typescript
builder.measures.add(field, (node) => {
  node.setFormat(...)
})
```

原因：

1. `add(field, callback)` 已足够表达格式配置
2. format 不是独立资源，不需要新的 `add*` 入口
3. 保持 builder API 面稳定，避免快捷方法持续膨胀

### 4. `buildVSeed` 负责将 `format` 映射到 VSeed 字段

VBI 到 VSeed 的适配规则如下：

1. `format` 为 `{ autoFormat: true }` 时，输出 `autoFormat: true`，不输出 `numFormat`
2. `format` 为自定义格式对象时，输出 `autoFormat: false` 和 `numFormat`
3. `format` 未设置时，不输出 `autoFormat` 和 `numFormat`

VBI 不向 VSeed 透传 `format` 字段本身。

VBI 的职责是表达统一配置，并在适配阶段映射为 VSeed 所需字段；VBI 不实现 formatter 创建逻辑，也不复制 VSeed 的格式化规则。

### 5. `practices/standard` 需要补齐格式设置 UI

Demo 需要把这组能力暴露到 measure shelf 的交互中。

接入方式：

1. 在 `practices/standard/src/components/Shelfs/shelves/MeasureShelf.tsx` 的 measure 菜单中新增 `Format` 入口
2. `Format` 不做多级 submenu，改为打开独立弹窗
3. 弹窗沿用当前 shelf 交互模式，建议新增一个与 `openShelfRenameModal` 同级的 `openMeasureFormatModal`

UI 结构：

1. 顶部提供格式模式切换：`Auto` / `Custom`
2. 选择 `Auto` 时，保存值为 `{ autoFormat: true }`
3. 选择 `Custom` 时，编辑 `NumFormat` 表单
4. 常用字段直接展示：`type`、`ratio`、`symbol`、`prefix`、`suffix`、`thousandSeparator`、`fractionDigits`
5. 低频字段放入高级区域：`significantDigits`、`roundingPriority`、`roundingMode`

保存和重置行为：

1. 保存自动格式：`setFormat({ autoFormat: true })`
2. 保存自定义格式：`setFormat(customFormat)`
3. 重置为默认行为：`clearFormat()`

对应配套改动：

1. `practices/standard/src/hooks/useVBIMeasures.ts` 中的 `MeasureNodeLike` 需要补上 `setFormat` / `getFormat` / `clearFormat`
2. `practices/standard/src/i18n/locales/zh-CN.json` 和 `practices/standard/src/i18n/locales/en-US.json` 需要新增 format 相关文案
3. 如需在列表中提示当前状态，可在 measure 标签上补一个轻量摘要，例如“自动”或“自定义”，但这不是首批必需项

### 6. 测试范围

VBI 核心测试覆盖以下内容：

1. `MeasureNodeBuilder` 可正确设置、读取和清空 `format`
2. `setFormat({ autoFormat: true })` 会正确表达自动格式
3. `setFormat(customFormat)` 会正确表达自定义格式
4. `clearFormat()` 会清除格式配置
5. `buildVSeed` 会正确完成 `format -> autoFormat / numFormat` 映射
6. `format` 未设置时，不写入冗余默认值

Demo 测试覆盖以下内容：

1. measure 菜单包含 `Format` 入口
2. 打开弹窗后可回填当前 `format`
3. 保存自动格式后能正确写回 builder
4. 保存自定义格式后能正确写回 builder
5. 重置后能调用 `clearFormat()`，回到默认行为

不在 VBI / Demo 中测试以下内容：

1. 最终 tooltip / label 的格式化字符串
2. VSeed formatter 的内部实现
3. 各类格式化规则的渲染正确性穷举

这些应由 VSeed 自身负责验证。

## Reference

- VSeed `NumFormat`: `packages/vseed/src/types/properties/format/numFormat.ts`
- VSeed `BaseMeasure`: `packages/vseed/src/types/properties/measures/baseMeasure.ts`
- VSeed formatter 入口: `packages/vseed/src/pipeline/utils/format/createFormatterByMeasure.ts`
- VBI `VBIMeasure`: `packages/vbi/src/types/dsl/measures/measures.ts`
- VBI `MeasureNodeBuilder`: `packages/vbi/src/builder/features/measures/mea-node-builder.ts`
- VBI `MeasuresBuilder`: `packages/vbi/src/builder/features/measures/mea-builder.ts`
- VBI `buildVSeed`: `packages/vbi/src/builder/adapters/vquery-vseed/build-vseed.ts`
- Demo measure shelf: `practices/standard/src/components/Shelfs/shelves/MeasureShelf.tsx`
- Demo measures hook: `practices/standard/src/hooks/useVBIMeasures.ts`

## 淘汰内容概述

本方案明确不采用以下设计：

- 不再对外暴露 `setAutoFormat` / `getAutoFormat` / `setNumFormat` / `getNumFormat`
- 不新增 `addWithFormat`、`addCurrency`、`addPercent` 等 `MeasuresBuilder` 便捷入口
- 不新增 `setCurrency`、`setWan`、`setK`、`setFractionDigits` 等大量语法糖方法
- 不向 VSeed 透传 VBI 的 `format` 字段本身，而是在适配阶段映射为 `autoFormat` / `numFormat`
- 不在 VBI / Demo 中承担 VSeed formatter 的实现和验证职责
