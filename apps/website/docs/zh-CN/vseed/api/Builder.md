# Builder

## Methods

### prepare

```ts
prepare(): Promise<void>
```

准备阶段 - 异步执行动态过滤器代码。

在 build() 之前调用，用于执行 dynamicFilter 中的 code。包含以下步骤：
1. 检查是否存在需要执行的 dynamicFilter (有 code 字段)
2. 如果存在，给 dataset 添加内部索引 __row_index
3. 生成 AdvancedVSeed 中间配置
4. 执行所有 dynamicFilter 的 code，将结果写入 filter.result
5. 缓存 AdvancedVSeed，供后续 build() 使用

**注意：**
- 此方法具有幂等性，多次调用不会重复执行
- 如果没有 dynamicFilter code，调用此方法无副作用
- 如果 dynamicFilter 只有静态 result 而没有 code，无需调用此方法

**Returns:** Promise<void>

**Example:**

// 有 dynamicFilter code 的场景
const builder = VBI.from(data, 'table')
  .dynamicFilter({ code: 'return data.filter(d => d.sales > 1000)' })

await builder.prepare()  // 异步执行 code
const spec = builder.build()  // 同步构建 spec

// 没有 dynamicFilter 的场景
const builder = VBI.from(data, 'table')
const spec = builder.build()  // 直接构建，无需 prepare

### build

```ts
build<T extends Spec>(): T
```

生成最终的图表配置 (Spec)。

这是最常用的核心方法。拿到 Spec 后，直接传给 VChart 或 VTable 即可渲染图表。

**注意：**
- 如果配置中包含 dynamicFilter code，需要先调用 prepare() 异步执行
- 如果已调用过 prepare()，build() 会复用缓存的结果，提升性能

**Returns:** VChart 或 VTable 的标准 Spec 对象。

**Example:**

// 场景 1: 无 dynamicFilter，直接构建
const spec = builder.build();

// 场景 2: 有 dynamicFilter code，先 prepare 再 build
await builder.prepare();
const spec = builder.build();

### buildSpec

```ts
buildSpec(advanced: AdvancedVSeed): Spec
```

将中间层配置 (AdvancedVSeed) 转换为最终 Spec。
仅当你需要深度定制中间层配置时使用。通常流程是：buildAdvanced() -> 修改配置 -> buildSpec()。

**Parameters:**

- 修改后的 AdvancedVSeed 对象。

**Returns:** VChart 或 VTable 的标准 Spec 对象。

### buildAdvanced

```ts
buildAdvanced(): AdvancedVSeed | null
```

生成中间层配置 (AdvancedVSeed)。
中间层配置也就是常说的 "图表模版"，它比原始 VSeed 更详细，暴露了更多图表细节（如坐标轴、图例的具体配置）。
如果默认的 build() 结果不满足需求，可以先获取这个中间配置进行修改，再调用 buildSpec 生成最终结果。

**Returns:** AdvancedVSeed 对象 (模版配置)。

### getColorItems

```ts
getColorItems(): __type[]
```

获取数据中涉及颜色的字段信息。
常用于生成图表的图例或颜色筛选器 UI。

**Returns:** 颜色字段列表 (包含 id 和别名)。

### getColorIdMap

```ts
getColorIdMap(): Record
```

获取颜色字段的详细映射表。

**Returns:** Key 为颜色 ID，Value 为详细信息的对象。

## Static Methods

### getAdvancedPipeline

```ts
static getAdvancedPipeline(chartType: ChartType): Pipe[]
```

[内部方法] 获取指定图表类型的模版构建管线。
用于查看或调试该图表类型是如何从 VSeed 转换为 AdvancedVSeed 的。

**Parameters:**

- 图表类型 (如 'bar', 'line')。

**Returns:** AdvancedPipeline 数组。

### getSpecPipeline

```ts
static getSpecPipeline(chartType: ChartType): SpecPipe[]
```

[内部方法] 获取指定图表类型的 Spec 构建管线。
用于查看或调试该图表类型是如何从 AdvancedVSeed 转换为 Spec 的。

**Parameters:**

- 图表类型。

**Returns:** SpecPipeline 数组。

### getTheme

```ts
static getTheme(themeKey?: string): CustomThemeConfig
```

获取指定主题的配置。

**Parameters:**

- 主题名称 (例如 'light', 'dark')。如果不传，默认为 'light'。

**Returns:** 主题配置对象。

### getThemeMap

```ts
static getThemeMap(): Record<string, CustomThemeConfig>
```

获取所有已注册的主题配置。

**Returns:** 主题配置映射表。

### from

```ts
static from(vseed: VSeed): Builder
```

静态工厂方法，用于便捷地创建 Builder 实例。

**Parameters:**

- VSeed 数据对象。

**Returns:** 新的 Builder 实例。

**Example:**

const builder = Builder.from(vseedJson);

### registerAdvancedPipeline

```ts
static registerAdvancedPipeline(chartType: ChartType, pipeline: AdvancedPipeline): void
```

[扩展方法] 注册一个新的图表类型（模版构建阶段）。
如果你要让 Builder 支持一种全新的图表，需要在这里注册它的模版构建逻辑。

**Parameters:**

- 新图表类型的名称。
- 处理管道数组。

### registerSpecPipeline

```ts
static registerSpecPipeline(chartType: ChartType, pipeline: SpecPipeline): void
```

[扩展方法] 注册一个新的图表类型（Spec 构建阶段）。
如果你要让 Builder 支持一种全新的图表，需要在这里注册它的 Spec 构建逻辑。

**Parameters:**

- 图表类型。
- 处理管道数组。

### updateAdvanced

```ts
static updateAdvanced(chartType: ChartType, pipe: AdvancedPipe): void
```

[扩展方法] 修改现有的图表模版构建逻辑。
可以在现有图表的构建流程中插入自定义逻辑（Pipe），从而影响生成的 AdvancedVSeed。

**Parameters:**

- 目标图表类型。
- 自定义处理函数。

### updateSpec

```ts
static updateSpec(chartType: ChartType, pipe: SpecPipe): void
```

[扩展方法] 修改现有的图表 Spec 构建逻辑。
可以在现有图表的构建流程中插入自定义逻辑（Pipe），从而影响生成的最终 Spec。

**Parameters:**

- 目标图表类型。
- 自定义处理函数。

### registerTheme

```ts
static registerTheme(key: string, theme: CustomThemeConfig): void
```

[扩展方法] 注册自定义主题。

**Parameters:**

- 主题名称。
- 主题配置对象。

## Properties

### get locale

```ts
get locale()
```

获取当前 Builder 使用的语言环境。

**Returns:** 语言环境代码 (如 'zh-CN', 'en-US')。

### get vseed

```ts
get vseed()
```

获取当前的 VSeed 输入数据。

### set vseed

```ts
set vseed(value)
```

更新 VSeed 输入数据。
更新后，后续调用 build() 将基于新数据生成。
**注意：** 更新 vseed 后会清除 prepare() 的缓存状态。

**Parameters:**

- 新的 VSeed 对象。

### get isPrepared

```ts
get isPrepared()
```

获取 prepare() 状态

### set isPrepared

```ts
set isPrepared(value: boolean)
```

设置 prepare() 状态

### get advancedVSeed

```ts
get advancedVSeed()
```

获取当前的 AdvancedVSeed 中间配置对象。

**Returns:** AdvancedVSeed 对象。

### set advancedVSeed

```ts
set advancedVSeed(value)
```

设置 AdvancedVSeed 中间配置对象。
通常用于缓存或复用已有的中间配置。

**Parameters:**

- 新的 AdvancedVSeed 对象。

### get spec

```ts
get spec()
```

获取当前生成的最终 Spec 对象。

**Returns:** Spec 对象。

### set spec

```ts
set spec(value)
```

设置 Spec 对象。
通常用于缓存。

**Parameters:**

- 新的 Spec 对象。

### get performance

```ts
get performance()
```

获取构建过程中的性能统计信息。

**Returns:** 包含各阶段耗时的对象 (单位: ms)。

### set performance

```ts
set performance(value)
```

设置性能统计信息。

**Parameters:**

- 新的性能统计对象。

