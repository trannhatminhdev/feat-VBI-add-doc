# 场景三处理流程：问题诊断

> **何时进入此流程**：用户反馈图表配置存在问题（报错、不生效、显示异常）。
>
> **触发方式**：新对话直接诊断（用户提供 schema + 问题描述）或对话延续诊断（生成后发现问题）。
>
> 对话延续场景中，即使用户只说"为什么不工作"，也应从历史提取 schema 进行诊断。
>
> 配置项查找遵循三步法，HTML 输出遵循标准流程，详见 `../common-workflow.md`。

---

## 处理步骤

### 步骤 1：收集问题信息

**1.1 获取 VSeed schema**

**场景 A：用户显式提供 schema**

直接使用用户提供的有问题的配置。

**场景 B：对话延续场景（用户未提供 schema）**

从对话历史中提取最近一次生成或修改的 VSeed 配置。

```javascript
// 示例：用户在场景1生成后说"为什么不显示"
// 从历史提取刚才生成的完整 schema
const problemSchema = extractFromHistory()
```

**1.2 问题描述收集**

- **预期行为**：用户希望图表如何显示/工作？
- **实际行为**：当前发生了什么（不显示、报错、样式异常等）？
- **错误信息**：浏览器控制台是否有错误提示？

**1.3 运行环境（可选）**

- VSeed 版本
- 浏览器类型

---

### 步骤 2：查询配置项定义

按三步法查阅与问题相关的配置项定义（详见 `../common-workflow.md#一配置项查找流程`）。

根据用户描述和错误信息，识别可能有问题的配置项（如 `dimensions`、`measures`、`label` 等），然后查阅对应的 type-details 和 rules。rules 文件中常定义了数据要求和取值范围，是诊断的关键参考——比如"动态图为什么不动"的根源通常在 rules 中的 player 维度约束。

---

### 步骤 3：基于类型定义诊断问题

对照步骤 2 查询到的类型定义和约束，逐项检查用户的 schema。

- 如果 `result.success === true`，schema 结构合法，问题可能在其他方面
- 如果 `result.success === false`，根据 `result.error` 定位问题

---

#### 常见问题诊断

##### 问题类别 A：配置项不符合类型定义

**A0. 典型报错快速定位**

| 报错片段                                  | 可能原因                    | 快速修复                                               |
| ----------------------------------------- | --------------------------- | ------------------------------------------------------ |
| `No matching discriminator` / `chartType` | 缺少 chartType 或拼写不合法 | 补充 `chartType`，值来自 `chart-type-guide.md`         |
| `expected: "string"` / `path: ["theme"]`  | theme 写成对象              | schema 中改为字符串主题名，主题对象通过 `--theme` 传入 |

**A1. chartType 无效**

**诊断方法**：

1. 参考 `../chart-type-guide.md` 确认支持的图表类型

**修正**：

```javascript
// 错误：拼写错误
{
  chartType: 'columns'
}

// 正确
{
  chartType: 'column'
}
```

---

**A2. dimension/measure 的 id 不存在于 dataset**

**诊断方法**：

1. 查询 type-details 确认 `id` 是必填字段
2. 检查 `id` 值是否与 dataset 字段名完全一致（区分大小写）

**修正**：

```javascript
// 错误：大小写不一致
dataset: [{ category: '类目A', value: 100 }]
dimensions: [{ id: 'Category' }] // 'C' 大写错误

// 正确：完全一致
dimensions: [{ id: 'category' }]
```

---

**A3. encoding 值不在类型定义的枚举范围内**

**诊断方法**：

1. 查询 type-details/{ChartType}Dimension.md 确认 `encoding` 的合法值
2. 必须查询 rules/{ChartType}Dimension.md 确认特殊约束（强制）
3. 检查用户使用的 encoding 是否在允许的枚举值中且符合 rules 约束

**修正**：

**诊断**：检查 encoding 是否为该图表类型支持的值

**修正**：参考 SKILL.md 中的编码通道映射表

```javascript
// 错误：柱状图的 dimension 不支持 yAxis encoding
{ chartType: 'column', dimensions: [{ id: 'category', encoding: 'yAxis' }] }

// 正确：柱状图 dimension 应使用 xAxis
{ chartType: 'column', dimensions: [{ id: 'category', encoding: 'xAxis' }] }
// 或不写 encoding，默认为 xAxis
{ chartType: 'column', dimensions: [{ id: 'category' }] }
```

---

**A4. 必填字段缺失**

```
错误信息: Required field 'xxx' is missing
```

**诊断**：检查是否缺少 chartType、dataset、dimensions、measures 等必填字段

**修正**：补充缺失字段

```javascript
// 错误：缺少 chartType
{
  dataset: [...],
  dimensions: [...],
  measures: [...]
}

// 正确
{
  chartType: 'column',
  dataset: [...],
  dimensions: [...],
  measures: [...]
}
```

---

##### 问题类别 B：渲染异常（Schema 验证通过但显示不正确）

**B1. 图表为空/不显示数据**

**可能原因**：

1. dataset 为空数组
2. dimensions/measures 的 id 与 dataset 字段名不匹配（大小写敏感）
3. 数据格式不符合 TidyData 规范

**诊断步骤**：

```javascript
// 1. 检查 dataset 是否有数据
console.log('dataset length:', schema.dataset.length)

// 2. 检查字段名是否匹配
const dataFields = Object.keys(schema.dataset[0] || {})
const dimIds = schema.dimensions.map((d) => d.id)
const measureIds = schema.measures.map((m) => m.id)

console.log('Dataset fields:', dataFields)
console.log('Dimension ids:', dimIds)
console.log('Measure ids:', measureIds)

// 3. 检查是否存在不匹配
const missingDims = dimIds.filter((id) => !dataFields.includes(id))
const missingMeasures = measureIds.filter((id) => !dataFields.includes(id))

if (missingDims.length) console.error('Missing dims:', missingDims)
if (missingMeasures.length) console.error('Missing measures:', missingMeasures)
```

---

**B2. 颜色分组不生效**

**可能原因**：

1. 未添加 `encoding: 'color'` 的 dimension
2. color dimension 的 id 不存在于 dataset

**修正**：

```javascript
// 添加颜色分组
dimensions: [
  { id: 'date' },
  { id: 'category', encoding: 'color' }, // 添加颜色编码
]
```

---

**B3. 坐标轴显示异常**

**可能原因**：

1. 轴配置覆盖了默认设置
2. 数据范围设置不合理

**诊断**：检查 xAxis/yAxis 配置

```javascript
// 检查是否有不合理的轴范围
if (schema.yAxis?.min !== undefined && schema.yAxis?.max !== undefined) {
  const dataMax = Math.max(...schema.dataset.map((d) => d[measureId]))
  if (schema.yAxis.max < dataMax) {
    console.warn('yAxis.max 小于数据最大值')
  }
}
```

---

**B4. 标签/图例/提示不显示**

**可能原因**：

1. `enable: false` 或未配置
2. 配置项名称错误

**修正**：

```javascript
// 显示标签
schema.label = { enable: true }

// 显示图例
schema.legend = { enable: true }

// 显示提示
schema.tooltip = { enable: true }
```

---

##### 问题类别 C：配置项不生效

**C1. 样式配置不生效**

**可能原因**：配置项路径错误或使用了不支持的属性

**诊断**：查阅 type-details 中对应组件的类型定义

```
top-keys/{chartType}.json → 找到 componentName
type-details/{componentName}.md → 查看支持的属性
```

---

**C2. 新增配置项不生效**

**可能原因**：该图表类型不支持此配置项

**诊断**：检查 ../top-keys/{chartType}.json 中是否包含该配置项

```javascript
// 例如：柱状图不支持 pointStyle（点样式）
// 查阅 ../top-keys/column.json，确认支持的配置项列表
```

---

### 问题类别 E：主题配置错误

诊断时请对照 [../theme-config-guide.md](../theme-config-guide.md) 进行核对。

**常见问题类型**：

| 问题                | 诊断                                                                  | 修正                                      |
| ------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| **E1** 字段类型错误 | `isDark` 非布尔值、颜色非十六进制                                     | 改为正确类型（`true`/`false`、`#RRGGBB`） |
| **E2** 数组数量不符 | colorScheme <8 或 >15、linearColorScheme <2 或 >10                    | 补充或删减至合规数量                      |
| **E3** 缺少必需字段 | 缺少 isDark/colorScheme/linearColorScheme/positiveColor/negativeColor | 添加缺失字段                              |

---

### 步骤 4：提供修复方案

根据诊断结果修复 schema，确保修复后符合 `../common-workflow.md#二核心-schema-约束`。

| 问题类型           | 修复操作                                     | 检查要点                    |
| ------------------ | -------------------------------------------- | --------------------------- |
| chartType 拼写错误 | 更正为正确的图表类型                         | 参考 ../chart-type-guide.md |
| id 不存在          | 统一 dataset 与 dimensions/measures 的字段名 | 区分大小写                  |
| encoding 错误      | 使用该图表支持的 encoding                    | 参考 SKILL.md 映射表        |
| 透视配置错误       | 分面用 row/column，坐标用 xAxis/yAxis        | 不要混淆                    |

---

### 步骤 5：输出诊断结果

使用 `scripts/generate_html.py` 脚本生成修复后的 HTML（脚本用法详见 `../common-workflow.md#三输出-html-标准流程`）。

**标准输出格式**：

````markdown
## 问题诊断结果

**问题类型**：[简要分类]

**发现的问题**：

- [问题 1]：[具体说明]

**修复方案**：

- [修复操作 1]

**生成命令**：

```bash
python <SKILL_DIR>/scripts/generate_html.py \
  --template <SKILL_DIR>/assets/template/generate.html \
  --title "[标题]" \
  --description "[描述]" \
  --schema '[修复后的完整 schema JSON]' \
  --output "[文件名].html"
```
````

**验证**：浏览器打开生成的 HTML，检查顶部是否显示"✓ Schema 验证通过"。

---

## 诊断检查清单

按以下顺序检查（核心约束详见 `../common-workflow.md#二核心-schema-约束`）：

- [ ] chartType 正确且支持
- [ ] dataset 为非空数组，符合 TidyData
- [ ] dimensions/measures 的 id 与 dataset 字段名完全一致（大小写）
- [ ] encoding 为该图表类型支持的值
- [ ] 配置项名称在 top-keys 中存在，属性符合 type-details
- [ ] 配置值符合 rules 约束条件
- [ ] theme（如使用）：符合 `../theme-config-guide.md` 规范
- [ ] zVSeed.safeParse 通过
