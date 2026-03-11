# 场景二处理流程：配置编辑

> **何时进入此流程**：在已有图表配置基础上进行增量修改（包括对话延续场景）。
>
> 即使用户未显式提供 schema，若对话历史中存在已生成配置，应从历史提取并按此流程处理。
>
> 配置项查找遵循三步法，HTML 输出遵循标准流程，详见 `../common-workflow.md`。

---

## 处理步骤

### 步骤 1：获取当前 Schema

**场景 A：用户显式提供 schema**

直接使用用户提供的配置。

**场景 B：对话延续场景（用户未提供 schema）**

从对话历史中提取最近一次生成或修改的完整 VSeed 配置。

**确认 schema 结构完整性**：

```javascript
// 检查必要字段
const requiredFields = ['chartType', 'dataset', 'dimensions', 'measures']
requiredFields.forEach((field) => {
  if (!schema[field]) {
    // 提示用户补充
  }
})
```

**关键约束补充**：

- `chartType` 必须为字符串且合法，禁止缺失
- `theme` 必须为字符串，禁止直接写对象
- 自定义主题通过脚本 `--theme` 传入，schema 只写主题名

**理解当前配置状态**：

- 识别图表类型 (`chartType`)
- 分析现有维度配置 (`dimensions`)
- 分析现有度量配置 (`measures`)
- 识别其他已配置项（legend、tooltip、label 等）

---

### 步骤 2：识别用户编辑意图

**使用 top-keys 将用户意图映射到配置项**：

| 用户表达                  | 匹配的配置项                                          | 查找路径                                             |
| ------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| "加个标签" / "显示数值"   | `label`                                               | ../top-keys/{chartType}.json → Label                 |
| "加个图例"                | `legend`                                              | ../top-keys/{chartType}.json → Legend                |
| "修改颜色"                | `color`                                               | ../top-keys/{chartType}.json → Color                 |
| "添加提示信息"            | `tooltip`                                             | ../top-keys/{chartType}.json → Tooltip               |
| "修改坐标轴"              | `xAxis` / `yAxis`                                     | ../top-keys/{chartType}.json                         |
| "添加标注线"              | `annotationHorizontalLine` / `annotationVerticalLine` | ../top-keys/{chartType}.json                         |
| "添加分组"                | `dimensions` 增加 encoding: 'color'                   | ../top-keys/{chartType}.json                         |
| "添加新指标"              | `measures` 增加新项                                   | ../top-keys/{chartType}.json                         |
| "用企业蓝色" / "改成深色" | theme（自定义主题配置）                               | [../theme-config-guide.md](../theme-config-guide.md) |
| "换配色方案" / "品牌色"   | theme（修改 colorScheme）                             | [../theme-config-guide.md](../theme-config-guide.md) |
| "堆叠变并列" / "不要堆叠" | chartType 切换（柱/条族内切换）                       | 参见 [场景 J](#场景-j柱状图条形图族类型切换)         |
| "改成百分比" / "看占比"   | chartType 切换（柱/条族内切换）                       | 参见 [场景 J](#场景-j柱状图条形图族类型切换)         |
| "横过来" / "改成条形图"   | chartType 切换（纵横互换）                            | 参见 [场景 J](#场景-j柱状图条形图族类型切换)         |

**透视和组合场景识别**：

| 用户表达                   | 编辑意图            | 配置操作                                             |
| -------------------------- | ------------------- | ---------------------------------------------------- |
| "按xx分组显示"             | 添加行透视          | `dimensions` 添加 `{ id: 'xx', encoding: 'row' }`    |
| "每个xx显示一个子图"       | 添加列透视          | `dimensions` 添加 `{ id: 'xx', encoding: 'column' }` |
| "xx和xx放一起，yy单独显示" | 度量重组            | 修改 `measures` 的 `parentId` 分组                   |
| "拆分成多个子图"           | 添加透视或组合      | 根据需求选择透视维度或度量组合                       |
| "合并显示多个指标"         | 度量合并            | 将多个 `measures` 设为相同 `parentId`                |
| "主副指标分离"             | 度量分组            | 主指标组和副指标组使用不同 `parentId`                |
| "添加新指标"               | `measures` 增加新项 | type-details/{Measure}.md                            |

---

### 步骤 3：查询配置项定义

**查询流程**（与生成场景相同）：

```
1. 查询 top-keys/{chartType}.json 获取配置项的 componentName
2. 读取 type-details/{ComponentName}.md 获取类型定义
3. 必须读取 rules/{ComponentName}.md 获取关键约束（强制）
```

**关键要求**：

- 不能跳过 rules 文件查阅，即使认为已经了解该配置项
- 尤其是修改 dimensions、measures、color 等关键配置时，必须查阅 rules 约束

**3.1 确定要修改的配置项**

根据用户需求识别需要修改的配置项（如 `label`、`tooltip`、`dimensions`、`measures` 等）。

**3.2 查询配置项类型定义**

从 `top-keys/{chartType}.json` 获取对应配置项的 `componentName`，然后按三步法查阅（详见 `../common-workflow.md`）。

---

### 步骤 4：执行编辑操作

基于步骤 3 查询到的类型定义和约束进行修改。

```javascript
// 添加新配置项
schema.label = { enable: true, position: 'top' }

// 修改现有配置项（保留原有配置）
schema.legend = { ...schema.legend, position: 'bottom' }
```

---

### 步骤 5：编辑规范检查

修改后的 schema 必须保持结构完整性（详见 `../common-workflow.md#二核心-schema-约束`）。

**编辑特有的检查项**：

- 新增 dimension/measure 的 `id` 必须在 dataset 中已存在（或同步添加）
- 修改的配置项必须是该图表类型支持的（查 top-keys）
- 删除 dimension/measure 后，确保至少各保留一个

| 错误类型         | 检查方法                     | 修正方案                        |
| ---------------- | ---------------------------- | ------------------------------- |
| 新字段 id 不存在 | 检查 dataset 是否包含该字段  | 先添加到 dataset 或使用已有字段 |
| encoding 不兼容  | 查 SKILL.md 编码通道映射表   | 使用该图表支持的 encoding       |
| 配置项不生效     | 查 top-keys/{chartType}.json | 确认该图表支持此配置            |
| 类型错误         | 查 type-details 类型定义     | 使用正确的值类型                |

**自定义主题**：用户有配色需求时，schema 只写主题名，主题对象通过 `--theme` 参数传入脚本。详见 `../theme-config-guide.md`。

---

### 步骤 6：输出可运行 HTML

使用 `scripts/generate_html.py` 脚本生成 HTML，禁止只输出修改片段。脚本参数详见 `../common-workflow.md#三输出-html-标准流程`。

**标准输出格式**：

````markdown
## 配置修改结果

**修改内容**：

- [修改点 1]：[说明]
- [修改点 2]：[说明]

**生成命令**：

```bash
python <SKILL_DIR>/scripts/generate_html.py \
  --template <SKILL_DIR>/assets/template/generate.html \
  --title "[标题]" \
  --description "[描述]" \
  --schema '[完整 schema JSON]' \
  --output "[文件名].html"
```
````

> 有配色修改需求时，额外添加 `--theme` 参数。

---

## 常见编辑场景示例

### 场景 A：添加数据标签

**用户需求**："给图表添加数据标签"

```javascript
schema.label = {
  enable: true,
  position: 'top',
}
```

---

### 场景 B：修改图例位置

**用户需求**："把图例移到底部"

**操作**：

```javascript
schema.legend = {
  enable: true,
  position: 'bottom',
  orient: 'horizontal',
}
```

### 场景 C：添加颜色分组

**用户需求**："按类型分组显示不同颜色"

**前提**：dataset 中存在 `type` 字段

**操作**：

```javascript
schema.dimensions.push({
  id: 'type',
  encoding: 'color',
})
```

### 场景 D：添加标注线

**用户需求**："添加一条平均值参考线"

**操作**：

```javascript
schema.annotationHorizontalLine = [
  {
    value: 100, // 或使用 valueField 指定数据字段
    text: '平均值',
    lineColor: '#ff0000',
    lineStyle: 'dashed',
  },
]
```

### 场景 E：修改坐标轴

**用户需求**："修改 Y 轴的显示范围"

**操作**：

```javascript
schema.yAxis = {
  ...schema.yAxis,
  min: 0,
  max: 1000,
  title: {
    visible: true,
    titleText: '销售额（万元）',
  },
}
```

### 场景 F：修改颜色方案

**用户需求**："使用自定义颜色"

**操作**：

```javascript
schema.color = {
  type: 'ordinal',
  range: ['#1890ff', '#2fc25b', '#facc14', '#f04864'],
}
```

### 场景 G：添加透视分面

**用户需求**："按地区分别显示子图"

**前提**：dataset 中存在 `region` 字段

**操作**：

```javascript
// 添加行透视（垂直分面）
schema.dimensions.push({
  id: 'region',
  alias: '地区',
  encoding: 'row',
})

// 或添加列透视（水平分面）
schema.dimensions.push({
  id: 'region',
  alias: '地区',
  encoding: 'column',
})
```

### 场景 H：创建度量组合图

**用户需求**："销售额和利润放一起，增长率单独显示"

**前提**：dataset 中存在对应字段

**操作**：

```javascript
// 重新配置 measures 的 parentId
schema.measures = [
  {
    id: 'sales',
    alias: '销售额',
    parentId: 'business-metrics',
  },
  {
    id: 'profit',
    alias: '利润',
    parentId: 'business-metrics', // 与销售额同组
  },
  {
    id: 'growth',
    alias: '增长率',
    parentId: 'rate-metrics', // 独立组
  },
]
```

### 场景 I：透视 + 组合复合配置

**用户需求**："按年份分列显示，每列中销售和成本一起，利润率单独"

**操作**：

```javascript
// 添加列透视
schema.dimensions.push({
  id: 'year',
  alias: '年份',
  encoding: 'column',
})

// 配置度量组合
schema.measures = [
  {
    id: 'sales',
    alias: '销售额',
    parentId: 'primary',
  },
  {
    id: 'cost',
    alias: '成本',
    parentId: 'primary', // 与销售额同子图
  },
  {
    id: 'profitRate',
    alias: '利润率',
    parentId: 'secondary', // 独立子图
  },
]
```

**效果**：每个年份一列，每列内有两个子图（销售成本图 + 利润率图）。

---

## 透视和组合编辑要点

### 透视维度编辑

1. **选择合适的维度**：通常选择分类较少的维度（2-6个值）
2. **考虑布局影响**：row 创建垂直布局，column 创建水平布局
3. **数据完整性**：确保每个分面都有数据
4. **避免过度分面**：总子图数量建议不超过12个
5. **关键警示**：
   - ❌ 不要混淆 `row`/`column`（透视）和 `xAxis`/`yAxis`（坐标轴）
   - ❌ "每行显示xx" → 使用 `encoding: 'row'`（不是 `yAxis`）
6. **平衡布局**：避免某个组的度量过多导致视觉失衡

### 复合配置注意事项

1. **复杂度控制**：透视 + 组合会显著增加图表复杂度
2. **性能考虑**：过多子图可能影响渲染性能
3. **用户体验**：确保最终图表对用户有明确的分析价值

---

### 场景 J：柱状图/条形图族类型切换

柱状图（Column 系列）和条形图（Bar 系列）各有三种子类型，结构对称。用户在编辑过程中可能需要在同族类型间切换。

> ⚠️ **关键提醒**：当用户说"不要堆积"、"不需要堆叠"、"分开显示"、"分别显示"等表达时，
> 这意味着需要将 `column` 切换为 `columnParallel`（或 `bar` → `barParallel`），而不是尝试在 `column` 类型上调整某个配置项。
> **`column` 类型的多度量行为就是堆叠**，无法通过配置项取消——必须切换 chartType。

#### 用户意图 → chartType 映射

| 用户表述（示例）                                                           | 识别意图      | 操作                                                                               |
| -------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| "堆积变并列"、"不要堆叠"、"分组展示"、"不需要堆积"、"分开显示"、"分别展示" | 堆叠 → 并列   | `column` → `columnParallel` 或 `bar` → `barParallel`                               |
| "并列变堆叠"、"合并到一起"、"堆叠起来"                                     | 并列 → 堆叠   | `columnParallel` → `column` 或 `barParallel` → `bar`                               |
| "改成百分比"、"看占比"、"显示比例"                                         | 任意 → 百分比 | `column`/`columnParallel` → `columnPercent`，Bar 同理                              |
| "不要百分比"、"看实际值"、"显示绝对值"                                     | 百分比 → 堆叠 | `columnPercent` → `column` 或 `barPercent` → `bar`                                 |
| "横过来"、"变成横向"、"改成条形图"                                         | 纵向 → 横向   | `column` → `bar`，`columnParallel` → `barParallel`，`columnPercent` → `barPercent` |
| "竖过来"、"变成纵向"、"改成柱状图"                                         | 横向 → 纵向   | `bar` → `column`，`barParallel` → `columnParallel`，`barPercent` → `columnPercent` |
| "百分比改成并列"、"占比变并排"                                             | 百分比 → 并列 | `columnPercent` → `columnParallel` 或 `barPercent` → `barParallel`                 |

#### 切换操作要点

**同族内切换**（如 `column` ↔ `columnParallel` ↔ `columnPercent`）：

- **只需修改 `chartType` 字段**，其余配置全部兼容
- `dataset`、`dimensions`、`measures` 直接复用
- `xAxis`、`yAxis`、`color`、`legend`、`tooltip`、`label` 配置通用
- `barStyle`、`stackCornerRadius`、`barMaxWidth`、`sort`、`sortLegend` 通用

**纵横互换**（如 `column` ↔ `bar`）：

- `dataset`、`dimensions`、`measures` 直接复用
- 坐标轴类型自动适配：Column X=类目轴/Y=数值轴 → Bar Y=类目轴/X=数值轴
- `sort` 含义变化：Column 排序针对 X 轴，Bar 排序针对 Y 轴
- 标注线方向变化：Column 的 `annotationVerticalLine`（维度标注）对应 Bar 的 `annotationHorizontalLine`

#### 独有配置差异

| 配置项                     | `column` / `bar`  | `columnParallel` / `barParallel` | `columnPercent` / `barPercent` |
| -------------------------- | ----------------- | -------------------------------- | ------------------------------ |
| `barGapInGroup`            | —                 | ✅ 控制同组柱间距                | —                              |
| 百分比标签                 | —                 | —                                | ✅ 默认开启                    |
| 占比计算                   | —                 | —                                | ✅ 默认开启                    |
| `polynomialRegressionLine` | ✅ 仅 column 支持 | —                                | —                              |

#### 操作示例

**用户需求**："把堆叠改成并列"（当前图表为 `column`）

```javascript
// 只需修改 chartType，其余配置保持不变
schema.chartType = 'columnParallel'
```

**用户需求**："横过来"（当前图表为 `columnParallel`）

```javascript
// 修改 chartType 为对应的 Bar 系列类型
schema.chartType = 'barParallel'
```
