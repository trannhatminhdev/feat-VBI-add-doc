# VBI DSL 扩展设计：指标和编码管理 API

## 1. VBI DSL 结构定义

### 1.1 VBIMeasure 数据结构

```typescript
interface VBIMeasure {
  field: string; // 数据字段名（不可修改）
  alias: string; // 用户定义的别名（可修改）
  encoding: 'yAxis' | 'xAxis' | 'color' | 'label' | 'tooltip' | 'size';
  aggregate: {
    func: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'quantile';
    quantile?: number; // 仅当 func === 'quantile' 时必需
  };
}
```

### 1.2 Zod Schema 定义

```typescript
// packages/vbi/src/types/dsl/measures/aggregate.ts
export const zAggregate = z.discriminatedUnion('func', [
  z.object({ func: z.literal(['sum', 'count', 'avg', 'min', 'max']) }),
  z.object({
    func: z.literal(['quantile']),
    quantile: z.number().min(0).max(1),
  }),
]);

// packages/vbi/src/types/dsl/measures/measures.ts
export const zVBIMeasure = z.object({
  field: z.string(),
  alias: z.string(),
  encoding: z.enum(['yAxis', 'xAxis', 'color', 'label', 'tooltip', 'size']),
  aggregate: zAggregate,
});

export type VBIMeasure = z.infer<typeof zVBIMeasure>;
```

---

## 2. MeasuresBuilder 扩展 API

### 2.1 新增方法：按索引获取指标节点

```typescript
/**
 * 获取指定位置的指标节点构建器，用于修改该指标的属性
 * @param index 指标在 Y.Array 中的位置（0-based）
 * @returns MeasureNodeBuilder 实例，如果索引越界则返回 undefined
 */
getMeasureNodeAt(index: number): MeasureNodeBuilder | undefined {
  const measures = this.dsl.get('measures') as Y.Array<Y.Map<any>>;
  if (index >= 0 && index < measures.length) {
    const yMap = measures.toArray()[index];  // Yjs 官方推荐方式
    return yMap ? new MeasureNodeBuilder(yMap) : undefined;
  }
  return undefined;
}
```

**使用场景**：

- 前端修改指定指标的别名
- 前端修改指定指标的聚合方式
- 前端修改指定指标的编码通道

---

### 2.2 新增方法：按索引删除指标

```typescript
/**
 * 删除指定位置的指标
 * @param index 指标在 Y.Array 中的位置（0-based）
 */
removeMeasureAt(index: number): void {
  const measures = this.dsl.get('measures') as Y.Array<Y.Map<any>>;
  if (index >= 0 && index < measures.length) {
    measures.delete(index, 1);  // 删除单个元素
  }
}
```

**使用场景**：前端删除指定的指标

---

### 2.3 已有方法（保持不变）

```typescript
// 添加指标（使用回调链式调用）
addMeasure(fieldOrMeasure: string | VBIMeasure): MeasureNodeBuilder;
addMeasure(
  fieldOrMeasure: string | VBIMeasure,
  callback: (node: MeasureNodeBuilder) => void
): MeasuresBuilder;

// 获取所有指标（用于前端初始化和监听更新）
getMeasures(): VBIMeasure[] {
  return this.dsl.get('measures').toJSON();
}

// 观察指标列表变化
observe(callback: ObserveCallback): void;
unobserve(callback: ObserveCallback): void;

// 按字段名删除指标
removeMeasure(field: string): void;
```

---

### 2.4 新增方法：添加指标（支持自定义聚合方式，用于任务1）

```typescript
/**
 * 便捷方法：直接指定初始聚合方式添加指标
 * @param field 字段名
 * @param aggregate 初始聚合方式
 * @returns MeasureNodeBuilder 实例
 */
addMeasureWithAggregate(
  field: string,
  aggregate: VBIMeasure['aggregate']
): MeasureNodeBuilder {
  return this.addMeasure(field, (node) => {
    node.setAggregate(aggregate);
  });
}
```

**设计说明**：

- 对离散字段（文本/日期）添加时，传 `{ func: 'count' }`
- 对数值字段添加时，传 `{ func: 'sum' }` 或其他聚合方式
- 本质是 `addMeasure()` 的便捷包装，保持向后兼容

---

## 3. MeasureNodeBuilder 既有 API（无需修改）

```typescript
export class MeasureNodeBuilder {
  /**
   * 修改指标别名
   */
  setAlias(alias: string): this;

  /**
   * 修改指标编码通道
   */
  setEncoding(encoding: VBIMeasure['encoding']): this;

  /**
   * 修改指标聚合方式
   */
  setAggregate(aggregate: VBIMeasure['aggregate']): this;

  /**
   * 获取最终的 VBIMeasure 对象
   */
  build(): VBIMeasure;
}
```

---

## 4. ChartTypeBuilder 扩展 API

### 4.1 新增方法：获取图表类型支持的编码

```typescript
export class ChartTypeBuilder {
  private readonly ENCODING_MAP: Record<string, string[]> = {
    // 表格类
    table: ['label', 'tooltip'],
    pivotTable: ['label', 'tooltip'],

    // 笛卡尔坐标系
    line: ['yAxis', 'xAxis', 'color'],
    column: ['yAxis', 'xAxis', 'color'],
    bar: ['xAxis', 'yAxis', 'color'],
    area: ['yAxis', 'xAxis', 'color'],
    scatter: ['xAxis', 'yAxis', 'size', 'color'],

    // 极坐标系
    pie: ['color'],
    donut: ['color'],
    rose: ['color'],

    // 其他
    funnel: ['color'],
    heatmap: ['xAxis', 'yAxis', 'color'],
    boxplot: ['yAxis', 'xAxis', 'color'],
    histogram: ['yAxis', 'color'],
  };

  /**
   * 获取指定图表类型支持的编码通道列表
   * @param chartType 图表类型字符串
   * @returns 支持的编码通道数组，未知类型返回 ['yAxis'] 作为默认值
   */
  getSupportedEncodings(chartType: string): string[] {
    return this.ENCODING_MAP[chartType] || ['yAxis'];
  }
}
```

**设计原则**：

- 使用类成员变量缓存映射表（避免每次调用重新创建）
- 未知图表类型返回默认值 `['yAxis']`，保证前端总有可选项
- 可扩展：添加新图表类型时只需更新 `ENCODING_MAP`

---

### 4.2 已有方法（保持不变）

```typescript
getChartType(): string;
changeChartType(chartType: string): void;
getAvailableChartTypes(): string[];
observe(callback: ObserveCallback): void;
unobserve(callback: ObserveCallback): void;
```

---

### 4.3 新增方法：切换图表类型并自动修复不兼容编码

```typescript
/**
 * 切换图表类型并自动修复不兼容的指标编码（用于任务7）
 * @param chartType 新图表类型
 * @param autoFix 是否自动修复。true 则改为支持的第一个编码；false 仅返回冲突列表
 * @returns 返回编码冲突的指标列表
 */
changeChartTypeWithAutoFix(
  chartType: string,
  autoFix: boolean = true
): { conflicts: Array<{ index: number; oldEncoding: string }> } {
  const supportedEncodings = this.getSupportedEncodings(chartType);
  const conflicts: Array<{ index: number; oldEncoding: string }> = [];

  // 遍历所有指标，检查编码兼容性
  const measures = this.dsl.get('measures') as Y.Array<Y.Map<any>>;
  for (let i = 0; i < measures.length; i++) {
    const yMap = measures.toArray()[i];
    const encoding = yMap.get('encoding');

    // 若当前编码不在新图表支持列表中
    if (!supportedEncodings.includes(encoding)) {
      conflicts.push({ index: i, oldEncoding: encoding });

      // 自动修复：改为支持的第一个编码
      if (autoFix) {
        yMap.set('encoding', supportedEncodings[0]);
      }
    }
  }

  // 切换图表类型
  this.dsl.set('chartType', chartType);

  return { conflicts };
}
```

**设计说明**：

- 调用前检查所有指标的编码兼容性
- `autoFix=true`：自动改为新图表支持的第一个编码
- `autoFix=false`：仅返回冲突列表，不修改数据（前端决定如何处理）
- 返回的冲突列表可用于显示修改提示或撤销操作

---

## 5. 数据流示例

### 前端修改指标别名的完整流程

```typescript
// 1. 前端获取指标
const measures = builder.measures.getMeasures();

// 2. 用户编辑并确认
const newAlias = '销售总和';
const index = 0;

// 3. 调用 VBI API
builder.measures.getMeasureNodeAt(index)?.setAlias(newAlias);

// 4. Yjs DSL 自动更新（通过 Y.Map.set()）

// 5. 前端监听更新
builder.measures.observe(() => {
  setMeasures(builder.measures.getMeasures());
});

// 6. UI 重新渲染
```

### 前端删除指标的流程

```typescript
// 1. 用户点击删除
const index = 0;

// 2. 调用 VBI API
builder.measures.removeMeasureAt(index);

// 3. observe 回调触发，前端自动更新列表
```

---

## 6. 类型安全保证

| 操作                          | 类型校验                                    | 异常处理           |
| ----------------------------- | ------------------------------------------- | ------------------ |
| `getMeasureNodeAt(index)`     | 返回 `\| undefined`，前端使用 `?.` 链式调用 | 越界返回 undefined |
| `removeMeasureAt(index)`      | 边界检查（>=0 且 < length）                 | 越界时不操作       |
| `setAlias(alias)`             | Zod string 校验                             | Zod 校验失败时抛出 |
| `setAggregate(agg)`           | Zod discriminatedUnion 校验                 | Zod 校验失败时抛出 |
| `getSupportedEncodings(type)` | 返回值总是数组                              | 未知类型返回默认值 |

---

## 7. 实现清单

| 方法                           | 所在类             | 状态     | 优先级  |
| ------------------------------ | ------------------ | -------- | ------- |
| `addMeasure()`                 | MeasuresBuilder    | 既有     | ✅      |
| `addMeasureWithAggregate()`    | MeasuresBuilder    | **新增** | 🔴 必须 |
| `getMeasureNodeAt()`           | MeasuresBuilder    | 新增     | 🔴 必须 |
| `removeMeasureAt()`            | MeasuresBuilder    | 新增     | 🔴 必须 |
| `getSupportedEncodings()`      | ChartTypeBuilder   | 新增     | 🔴 必须 |
| `changeChartTypeWithAutoFix()` | ChartTypeBuilder   | **新增** | 🔴 必须 |
| `setAlias()`                   | MeasureNodeBuilder | 既有     | ✅      |
| `setEncoding()`                | MeasureNodeBuilder | 既有     | ✅      |
| `setAggregate()`               | MeasureNodeBuilder | 既有     | ✅      |

---

## 8. 前端集成简述

前端通过以上 API 实现：

- **任务1**：新增指标（使用新增的 `addMeasureWithAggregate(field, aggregate)`，前端指定初始聚合方式）
- **任务2**：展示指标卡片（使用 `getMeasures()`）
- **任务4**：删除指标（使用 `removeMeasureAt()`）
- **任务6**：修改别名（使用 `getMeasureNodeAt().setAlias()`）
- **任务5**：修改聚合（使用 `getMeasureNodeAt().setAggregate()`）
- **任务3**：修改编码（使用 `getMeasureNodeAt().setEncoding()` + `getSupportedEncodings()`）
- **任务7**：图表类型带编码切换（使用 `changeChartTypeWithAutoFix(chartType, autoFix)`，自动修复或提示不兼容编码）
