# VSeed 图表类型选择指南

> **文档定位**：帮助快速选择合适的图表类型。详细配置规则请查阅 top-keys 和 type-details。

---

## 图表类型速查表

| 图表类型       | chartType        | top-keys 入口                | 适用场景                                         | 维度数量 | 度量数量 |
| -------------- | ---------------- | ---------------------------- | ------------------------------------------------ | -------- | -------- |
| 柱状图（堆叠） | `column`         | top-keys/column.json         | 纵向类目比较，多系列默认**堆叠**展示             | 1-2      | 1+       |
| 并列柱状图     | `columnParallel` | top-keys/columnParallel.json | 纵向多指标**并列/分组**对比，柱子并排排列        | 1-2      | 2+       |
| 百分比柱状图   | `columnPercent`  | top-keys/columnPercent.json  | 纵向**百分比堆叠**，展示各类别占比关系           | 1-2      | 1+       |
| 条形图（堆叠） | `bar`            | top-keys/bar.json            | 横向类目比较，多系列默认**堆叠**展示，适合长标签 | 1-2      | 1+       |
| 并列条形图     | `barParallel`    | top-keys/barParallel.json    | 横向多指标**并列/分组**对比，条形并排排列        | 1-2      | 2+       |
| 百分比条形图   | `barPercent`     | top-keys/barPercent.json     | 横向**百分比堆叠**，展示各类别占比关系           | 1-2      | 1+       |
| 折线图         | `line`           | top-keys/line.json           | 时间序列、趋势变化                               | 1-2      | 1+       |
| 面积图         | `area`           | top-keys/area.json           | 时间序列、累积量感                               | 1-2      | 1+       |
| 饼图           | `pie`            | top-keys/pie.json            | 占比分布、构成分析                               | 1        | 1        |
| 环形图         | `donut`          | top-keys/donut.json          | 占比分布、中心指标展示                           | 1        | 1        |
| 散点图         | `scatter`        | top-keys/scatter.json        | 相关性分析、分布展示（**静态**）                 | 0-1      | 2-3      |
| 雷达图         | `radar`          | top-keys/radar.json          | 多维度评分、综合对比                             | 1-2      | 1+       |
| 玫瑰图         | `rose`           | top-keys/rose.json           | 极坐标占比、周期性数据                           | 1        | 1        |
| 漏斗图         | `funnel`         | top-keys/funnel.json         | 流程转化、阶段分析                               | 1        | 1        |
| 热力图         | `heatmap`        | top-keys/heatmap.json        | 矩阵分布、密度展示                               | 2        | 1        |
| 直方图         | `histogram`      | top-keys/histogram.json      | 数值分布、频率统计                               | 0        | 1        |
| 箱线图         | `boxPlot`        | top-keys/boxPlot.json        | 数据分布、异常值检测                             | 1        | 1        |
| 双轴图         | `dualAxis`       | top-keys/dualAxis.json       | 不同量纲对比、主次指标                           | 1-2      | 2+       |
| 并列玫瑰图     | `roseParallel`   | top-keys/roseParallel.json   | 多指标极坐标并列对比                             | 1        | 2+       |
| 百分比面积图   | `areaPercent`    | top-keys/areaPercent.json    | 百分比累积、占比变化                             | 1-2      | 1+       |
| 动态条形图     | `raceBar`        | top-keys/raceBar.json        | 排名竞赛、时间演变动画                           | 2        | 1+       |
| 动态柱状图     | `raceColumn`     | top-keys/raceColumn.json     | 排名竞赛、时间演变动画                           | 2        | 1+       |
| 动态散点图     | `raceScatter`    | top-keys/raceScatter.json    | 多指标时间演变、实体轨迹（**动态**）             | 1        | 2-3      |
| 动态饼图       | `racePie`        | top-keys/racePie.json        | 占比演变、动态构成分析                           | 1-2      | 1        |
| 动态环形图     | `raceDonut`      | top-keys/raceDonut.json      | 占比演变、中心指标动画                           | 1-2      | 1        |
| 动态折线图     | `raceLine`       | top-keys/raceLine.json       | 趋势演变、轨迹动画                               | 1-2      | 1+       |
| 旭日图         | `sunburst`       | top-keys/sunburst.json       | 层级占比、多层级结构展示                         | 多层级   | 1        |
| 矩形树图       | `treeMap`        | top-keys/treeMap.json        | 层级占比、空间利用率高                           | 多层级   | 1        |
| 圆形闭包图     | `circlePacking`  | top-keys/circlePacking.json  | 层级包含、嵌套关系展示                           | 多层级   | 1        |
| 表格           | `table`          | top-keys/table.json          | 明细数据展示、多字段查看                         | 多个     | 多个     |
| 透视表         | `pivotTable`     | top-keys/pivotTable.json     | 交叉分析、汇总统计                               | 多个     | 多个     |

---

## 按场景快速选择

> ⚠️ **首要判断**：用户是否需要**动态/时间演变**效果？
>
> - **需要动态** → 查看"动态竞赛"类别
> - **不需要动态** → 查看其他类别

| 场景类别     | 具体需求                                         | 推荐图表类型                    | 🔄 动态版本提示           |
| ------------ | ------------------------------------------------ | ------------------------------- | ------------------------- |
| **比较类**   | 简单类目比较（单指标）                           | `column`、`bar`                 | → `raceColumn`、`raceBar` |
|              | 多指标并列对比（⚠️ 同比/环比、多维度指标对比等） | `columnParallel`、`barParallel` | -                         |
|              | 长标签展示                                       | `bar`                           | → `raceBar`               |
| **趋势类**   | 单一趋势线                                       | `line`                          | → `raceLine`              |
|              | 累积量感                                         | `area`                          | -                         |
|              | 占比变化趋势                                     | `areaPercent`、`columnPercent`  | -                         |
| **占比类**   | 简单占比分布                                     | `pie`、`donut`                  | → `racePie`、`raceDonut`  |
|              | 百分比堆叠                                       | `columnPercent`、`barPercent`   | -                         |
|              | 多层级占比展示                                   | `sunburst`、`treeMap`           | -                         |
| **分布类**   | 两变量相关性（静态）                             | `scatter`                       | → `raceScatter`（动态）   |
|              | 两变量演变轨迹（动态）                           | **`raceScatter`**               | -                         |
|              | 数值频率分布                                     | `histogram`                     | -                         |
|              | 数据分布统计                                     | `boxPlot`                       | -                         |
|              | 矩阵密度分布                                     | `heatmap`                       | -                         |
| **层级类**   | 多层级占比展示                                   | `sunburst`、`treeMap`           | -                         |
|              | 包含关系展示                                     | `circlePacking`                 | -                         |
|              | 空间利用率优先                                   | `treeMap`                       | -                         |
| **特殊类**   | 流程转化分析                                     | `funnel`                        | -                         |
|              | 多维度综合评分                                   | `radar`                         | -                         |
|              | 不同量纲双轴展示                                 | `dualAxis`                      | -                         |
|              | 周期性数据展示                                   | `rose`                          | -                         |
| **动态竞赛** | 排名竞赛演变                                     | `raceBar`、`raceColumn`         | -                         |
|              | 多指标时间演变动画                               | `raceScatter`                   | -                         |
|              | 实体轨迹追踪                                     | `raceScatter`                   | -                         |
|              | 占比构成动态演变                                 | `racePie`、`raceDonut`          | -                         |
|              | 趋势轨迹动态展示                                 | `raceLine`                      | -                         |
| **数据表格** | 明细数据展示                                     | `table`                         | -                         |
|              | 行列交叉汇总                                     | `pivotTable`                    | -                         |

---

## 特殊图表类型说明

### 动态竞赛图表

动态竞赛图表支持时间轴播放动画，所有类型均需配置：

- **player 维度**：`encoding: 'player'`，必须是有序时间/序列数据
- **player 配置**：指定播放器控件（field、interval、loop、autoPlay）
- **详细约束**：查阅 `rules/{Race*Dimension}.md`

| chartType     | 关键特征                                | 详细规则                      |
| ------------- | --------------------------------------- | ----------------------------- |
| `raceBar`     | 横向排名竞赛，需 player + yAxis 维度    | rules/RaceBarDimension.md     |
| `raceColumn`  | 纵向排名竞赛，需 player + xAxis 维度    | rules/RaceColumnDimension.md  |
| `raceScatter` | 多指标轨迹演变，需 player 维度          | rules/RaceScatterDimension.md |
| `racePie`     | 占比演变，需 player + color 维度        | rules/RacePieDimension.md     |
| `raceDonut`   | 占比演变（中心指标），需 player + color | rules/RaceDonutDimension.md   |
| `raceLine`    | 趋势动画，需 xAxis 维度（可选 player）  | rules/RaceLineDimension.md    |

### 层级结构图表

层级图表使用 HierarchyDimension 定义多层级嵌套关系：

| chartType       | 布局特点   | 适用层级 | 主要优势         |
| --------------- | ---------- | -------- | ---------------- |
| `sunburst`      | 放射状圆环 | 2-5 层   | 直观展示层级关系 |
| `treeMap`       | 矩形嵌套   | 2-5 层   | 空间利用率高     |
| `circlePacking` | 圆形嵌套   | 2-5 层   | 强调包含关系     |

**配置要点**：

- 维度配置：多个维度字段定义层级关系（从父到子）
- 数据要求：需预先聚合
- 配置入口：查阅对应 `top-keys/{chartType}.json`

---

## 图表选择决策树

```
用户数据特征是什么？
│
├─ 类目 + 数值
│   ├─ 单指标比较大小 → column / bar
│   ├─ 多指标（≥2个度量）且需对比各指标 → columnParallel / barParallel ⚠️
│   │   （同比/环比、收入/支出、多产品指标 等场景）
│   ├─ 多指标但关注总量构成（部分+整体） → column / bar（堆叠）
│   ├─ 占比分布 → pie / donut
│   └─ 百分比堆叠 → columnPercent / barPercent
│
├─ 时间序列 + 数值
│   ├─ 趋势变化 → line
│   ├─ 累积量感 → area
│   └─ 占比变化 → areaPercent
│
├─ 两个数值维度
│   ├─ 相关性分析 → scatter
│   └─ 矩阵密度 → heatmap
│
├─ 多维度评分
│   └─ 综合对比 → radar
│
├─ 流程阶段数据
│   └─ 转化漏斗 → funnel
│
├─ 不同量纲指标
│   └─ 双轴对比 → dualAxis
│
├─ 层级/树形数据
│   ├─ 层级占比 → sunburst / treeMap
│   ├─ 包含关系 → circlePacking
│   ├─ 空间利用率优先 → treeMap
│   └─ 放射状展示 → sunburst
│
├─ 时间序列 + 排名竞赛
│   ├─ 排名演变动画 → raceBar / raceColumn
│   └─ 多指标演变轨迹 → raceScatter
│
└─ 明细数据
    ├─ 简单展示 → table
    └─ 交叉分析 → pivotTable
```

---

## ⚠️ column vs columnParallel 选型指南（关键区分）

> **这是最常见的图表类型误选场景**：当用户需要展示多个指标（如同比/环比、收入/支出、多产品对比）时，
> `column` 会将多个指标**堆叠**在同一柱子上，而 `columnParallel` 会将它们**并排放置**以便直接对比。
> 大多数"多指标对比"场景应选择 `columnParallel` 而非 `column`。

### 选型决策规则

| 判断条件                                    | 选择                 | 原因                                |
| ------------------------------------------- | -------------------- | ----------------------------------- |
| 只有 1 个度量（如"销售额"）                 | `column`             | 单指标无需并列                      |
| 多个度量，想看**各指标独立大小对比**        | **`columnParallel`** | 并列排列，直观比较不同指标的绝对值  |
| 多个度量，想看**总量构成**（部分+整体）     | `column`             | 堆叠展示每个部分占总量的比例        |
| 用户提到"不要堆积/堆叠"、"分开显示"、"并列" | **`columnParallel`** | 明确拒绝堆叠 = 选并列               |
| 用户提到"同比"、"环比"、"对比"、"vs"        | **`columnParallel`** | 同比/环比属于独立指标对比，不应堆叠 |
| 用户提到"各省份的 GDP 和人口"等多指标       | **`columnParallel`** | 不同量纲/含义的指标不应堆叠         |

### 典型场景示例

```
❌ 错误：用 column 展示 GDP同比 + GDP环比   → 两个指标被堆叠，用户无法直观对比
✅ 正确：用 columnParallel 展示 GDP同比 + GDP环比 → 两个指标并排显示，一目了然

❌ 错误：用 column 展示 收入 + 支出          → 堆叠后只能看总量，无法逐项比较
✅ 正确：用 columnParallel 展示 收入 + 支出    → 并列显示，方便对比每个类目下的收入vs支出

✅ 合理：用 column 展示 各产品线的营收构成     → 每个柱子的堆叠部分代表不同产品线占总营收
```

### 快速判断口诀

**"多指标要对比 → columnParallel；多指标看构成 → column"**

> Bar 系列同理：`bar` (堆叠) vs `barParallel` (并列)，横向版本的选择逻辑完全一致。

---

## 柱状图与条形图族类型说明

柱状图（Column 系列）和条形图（Bar 系列）各有三种子类型，结构对称：

| 纵向（Column 系列） | 横向（Bar 系列） | 共同特征                           |
| ------------------- | ---------------- | ---------------------------------- |
| `column`            | `bar`            | 默认堆叠，单指标或多指标自动合并   |
| `columnParallel`    | `barParallel`    | 并列排列，多指标独立展示、直接对比 |
| `columnPercent`     | `barPercent`     | 百分比堆叠，展示各类别占比关系     |

> 用户在编辑过程中可能需要在同族类型间切换（如 "堆叠变并列"、"改成百分比"、"横过来" 等），详细的意图识别与切换操作请参考 [workflows/scenario-2-editing.md](workflows/scenario-2-editing.md#场景-j柱状图条形图族类型切换)。

---

## 高级图表模式：透视和组合

### 透视图表（Pivot Charts）

通过在 `dimensions` 中使用 `row` 或 `column` encoding 创建分面图表。

#### 适用场景

| 需求描述               | 透视配置               | 效果                   |
| ---------------------- | ---------------------- | ---------------------- |
| "按地区分别显示"       | `encoding: 'row'`      | 垂直排列的地区子图     |
| "每年显示一个子图"     | `encoding: 'column'`   | 水平排列的年份子图     |
| "按地区分行，按年分列" | 同时使用 row 和 column | 2x3 网格布局子图       |
| "多维度对比分析"       | 透视 + 颜色分组        | 每个分面内还有颜色分组 |

#### 透视图表类型支持

| 基础图表类型 | 透视支持 | 推荐透视维度         | 示例场景                |
| ------------ | -------- | -------------------- | ----------------------- |
| `column`     | ✅       | 地区、时间、产品类别 | 各地区销售趋势对比      |
| `bar`        | ✅       | 部门、类型、等级     | 各部门绩效指标对比      |
| `line`       | ✅       | 品类、客户类型       | 不同品类的趋势对比      |
| `area`       | ✅       | 渠道、用户群体       | 各渠道流量趋势          |
| `scatter`    | ✅       | 实验组、市场         | 不同市场的价格-销量分布 |

### 度量组合图（Measure Combination）

通过在 `measures` 中使用不同的 `parentId` 将度量分配到不同子图。

#### 适用场景

| 需求描述                   | 组合配置                      | 效果                   |
| -------------------------- | ----------------------------- | ---------------------- |
| "销售额和利润一起显示"     | 相同 `parentId`               | 同一子图内的并列或堆叠 |
| "收入成本一起，利润率单独" | 两个不同的 `parentId`         | 两个独立子图           |
| "主要指标 + 次要指标"      | `primary` 和 `secondary` 分组 | 主副指标分离展示       |
| "多业务线组合分析"         | 按业务线分配 `parentId`       | 每个业务线一个子图     |

#### 组合图表类型支持

| 基础图表类型 | 组合支持 | 组合优势            | 典型组合               |
| ------------ | -------- | ------------------- | ---------------------- |
| `column`     | ✅       | 不同量纲指标独立Y轴 | 收入+成本 vs 利润率    |
| `bar`        | ✅       | 横向对比多指标组合  | 数量+金额 vs 满意度    |
| `line`       | ✅       | 趋势 + 比率双重分析 | 销售趋势 vs 增长率     |
| `area`       | ✅       | 累积量 + 占比分析   | 总量趋势 vs 市场份额   |
| `scatter`    | ✅       | 多维度相关性分析    | 价格-销量 vs 价格-利润 |

### 复合模式：透视 + 组合

结合透视和度量组合，创建最复杂的多维分析图表。

#### 配置示例

```json
{
  "chartType": "column",
  "dimensions": [
    { "id": "category", "alias": "产品类别" },
    { "id": "region", "encoding": "row" }, // 透视：按地区分行
    { "id": "year", "encoding": "column" } // 透视：按年份分列
  ],
  "measures": [
    { "id": "sales", "parentId": "business", "alias": "销售额" },
    { "id": "cost", "parentId": "business", "alias": "成本" },
    { "id": "satisfaction", "parentId": "quality", "alias": "满意度" }
  ]
}
```

**效果**：创建 地区×年份 的网格布局，每个网格内有两个子图（业务指标图 + 质量指标图）。

### 选择建议

#### 何时使用透视图

- ✅ 需要对比不同分类的数据模式
- ✅ 数据有明确的分组结构（地区、时间、类型等）
- ✅ 希望保持每个分组内的详细信息
- ❌ 分组过多（建议不超过6个分组）
- ❌ 单个分组内数据点过少

#### 何时使用组合图

- ✅ 多个相关指标需要同时分析
- ✅ 不同量纲的指标需要独立的坐标轴
- ✅ 主次指标关系明确
- ❌ 指标之间完全无关联
- ❌ 用户需要简单直观的对比

#### 何时使用复合模式

- ✅ 复杂的业务分析需求
- ✅ 多维度、多指标的综合洞察
- ✅ 用户具备较强的图表阅读能力
- ❌ 简单的数据展示需求
- ❌ 移动端或小屏幕展示
