# 场景一处理流程：配置生成

> **何时进入此流程**：用户希望从 0 到 1 创建新图表。详细场景识别规则见 SKILL.md。

---

## 流程概览

配置生成遵循 6 步流程，其中步骤 3 的配置项查找和步骤 6 的 HTML 输出遵循 `common-workflow.md` 中的标准流程。

1. 解析用户数据
2. 识别图表类型与意图
3. 查询图表配置项定义（遵循三步法，详见 `../common-workflow.md#一配置项查找流程`）
4. 生成配置项内容
5. Schema 规范检查（约束详见 `../common-workflow.md#二核心-schema-约束`）
6. 输出可运行 HTML（脚本用法详见 `../common-workflow.md#三输出-html-标准流程`）

---

## 标准生成流程

### 步骤 1：解析用户数据

**确认数据符合 TidyData 规范**：

- 一个字段对应一列
- 一个记录对应一行
- 字段名即为 dimensions/measures 中的 `id`

```javascript
// TidyData 示例
const dataset = [
  { category: '类目A', value: 100, date: '2024-01' },
  { category: '类目B', value: 200, date: '2024-01' },
  { category: '类目A', value: 150, date: '2024-02' },
  { category: '类目B', value: 180, date: '2024-02' },
]
```

**如果用户未提供数据**：

- 根据用户描述构造合理的 Mock 数据（至少 5 条记录）
- 确保字段名语义清晰

---

### 步骤 2：选择图表类型

> 💡 **本步骤的输出将直接成为 schema 中 `chartType` 字段的值**（如 `"column"`、`"bar"`、`"line"` 等）

> ⚠️ **首要检查**：用户是否提到"动态"、"演变"、"动画"、"播放"、"时间变化"等关键词？
>
> - **如果是** → 跳转到下方"动态竞赛图表识别"表格
> - **如果否** → 使用下方基础图表类型表格

**参考 `../chart-type-guide.md` 根据用户需求推断图表类型**：

| 数据特征        | 可视化目的  | 推荐类型                            | ⚠️ 动态版本提示                      |
| --------------- | ----------- | ----------------------------------- | ------------------------------------ |
| 类目 + 单个数值 | 比较大小    | `column`、`bar`                     | 有排名演变 → `raceColumn`、`raceBar` |
| 类目 + 多个数值 | 多指标对比  | **`columnParallel`**、`barParallel` | -                                    |
| 类目 + 多个数值 | 总量构成    | `column`（堆叠）                    | -                                    |
| 类目 + 数值     | 占比分布    | `pie`、`donut`                      | 有时间演变 → `racePie`、`raceDonut`  |
| 时间序列 + 数值 | 趋势变化    | `line`                              | 有轨迹动画 → `raceLine`              |
| 时间序列 + 数值 | 累积量感    | `area`                              | -                                    |
| 两个数值维度    | 相关性/分布 | `scatter`                           | **有时间演变 → `raceScatter`**       |
| 多维度评分      | 综合对比    | `radar`                             | -                                    |
| 流程阶段        | 转化漏斗    | `funnel`                            | -                                    |
| 不同量纲        | 双轴对比    | `dualAxis`                          | -                                    |
| 明细数据        | 表格展示    | `table`、`pivotTable`               |

**⚠️ 重要：column vs columnParallel 选型（最常见误选）**：

> 当用户描述涉及**多个度量指标**的比较时（如"同比和环比"、"收入与支出"、"GDP和人口"等），
> 默认应选择 `columnParallel` 而非 `column`。因为 `column` 会将多个指标**堆叠**显示，
> 而用户通常希望**并列对比**这些指标。

| 用户表述（示例）                         | ❌ 错误选择  | ✅ 正确选择          | 原因                            |
| ---------------------------------------- | ------------ | -------------------- | ------------------------------- |
| "各省份的GDP同比和环比"                  | ~~`column`~~ | **`columnParallel`** | 同比/环比是独立指标，需并列对比 |
| "展示各城市的收入和支出"                 | ~~`column`~~ | **`columnParallel`** | 收入/支出需独立比较，不应堆叠   |
| "各产品的销量和利润率"                   | ~~`column`~~ | **`columnParallel`** | 不同量纲指标不应堆叠            |
| "不要堆积"、"不需要堆叠"、"分开显示"     | ~~`column`~~ | **`columnParallel`** | 用户明确拒绝堆叠                |
| "各部门费用的构成明细（人力+差旅+办公）" | `column`     | `column`             | 关注总量中各部分构成 → 堆叠合理 |
| "展示各季度销售额"（单一度量）           | `column`     | `column`             | 只有一个度量，堆叠/并列无区别   |

**判断口诀**：多指标要对比 → `columnParallel`；多指标看构成 → `column`。详见 `../chart-type-guide.md` 的选型指南。

**⚠️ 重要：动态竞赛图表识别**（避免误选普通图表）：

> **识别原则**：只要用户提到"动态"、"演变"、"动画"、"播放"、"时间变化"、"随时间"等关键词，优先考虑动态图表（race\* 系列）

| 用户表达                       | ❌ 错误识别    | ✅ 正确识别              | 关键区别                             |
| ------------------------------ | -------------- | ------------------------ | ------------------------------------ |
| "生成散点图"                   | `scatter`      | `scatter`                | 无时间维度播放（静态）               |
| "生成**动态**散点图"           | ~~scatter~~    | **`raceScatter`**        | 需要 `encoding: 'player'` 的时间维度 |
| "希望创建**动态**散点图"       | ~~scatter~~    | **`raceScatter`**        | "动态"是关键词                       |
| "散点图**演变**"               | ~~scatter~~    | **`raceScatter`**        | "演变"表示随时间变化                 |
| "散点图**随时间变化**"         | ~~scatter~~    | **`raceScatter`**        | 明确时间维度                         |
| "多个国家的散点图**时间序列**" | ~~scatter~~    | **`raceScatter`**        | 时间序列 + 多实体                    |
| "国家发展轨迹"                 | ~~scatter~~    | **`raceScatter`**        | 轨迹 = 时间演变                      |
| "看各国在图上的**移动**"       | ~~scatter~~    | **`raceScatter`**        | 移动 = 动态变化                      |
| "排名柱图演变"                 | ~~column~~     | **`raceColumn`**         | 需要 player 维度 + sort 配置         |
| "国家排名竞赛"                 | ~~bar/column~~ | **`raceBar/raceColumn`** | 涉及时间轴排名变化                   |
| "占比随时间演变"               | ~~pie/donut~~  | **`racePie/raceDonut`**  | 扇区占比动态变化                     |
| "市场份额动画"                 | ~~pie/donut~~  | **`racePie/raceDonut`**  | 各分类占比随时间播放                 |
| "趋势轨迹动画"                 | ~~line~~       | **`raceLine`**           | 折线随时间逐步绘制                   |
| "多实体时序对比"               | ~~line~~       | **`raceLine`**           | 多条线随播放器延伸                   |

**动态竞赛图表的约束识别**：

| 识别信号            | 图表特性                                   | 需要的配置                                 |
| ------------------- | ------------------------------------------ | ------------------------------------------ |
| **含有时间轴概念**  | 用户提到"演变"、"变化"、"动画"、"播放"等   | dimensions 需 `encoding: 'player'`         |
| **有排名概念**      | 用户提到"排名"、"竞赛"、"排序变化"         | `raceBar` / `raceColumn` + `sort` 配置     |
| **多轨迹演变**      | 用户提到多个实体的轨迹变化（如国家、产品） | `raceScatter` + 颜色区分                   |
| **散点图 + 时间**   | 用户提到"散点图"且有"动态/演变/时间"关键词 | **优先选择 `raceScatter`，不是 `scatter`** |
| **实体移动/轨迹**   | 用户提到"移动"、"轨迹"、"路径"             | `raceScatter` 适合展示实体运动轨迹         |
| **占比构成演变**    | 用户提到"占比随时间变化"、"份额演变"       | `racePie` / `raceDonut` + 分类维度         |
| **趋势轨迹动画**    | 用户提到"折线回放"、"趋势追踪"             | `raceLine` + 播放器控制                    |
| **Player 维度要求** | 必须有有序的时间/序列维度                  | 读取 rules/{Race\*Dimension}.md 了解约束   |

**高级图表模式识别**：

| 用户需求描述                 | 推荐模式          | 关键配置                             |
| ---------------------------- | ----------------- | ------------------------------------ |
| "按xx分组显示"               | 透视图            | dimensions 添加 `encoding: 'row'`    |
| "每个xx显示一个子图"         | 透视图            | dimensions 添加 `encoding: 'column'` |
| "每行显示xx"                 | 行透视图          | 分组字段设为 `encoding: 'row'`       |
| "每列显示xx"                 | 列透视图          | 分组字段设为 `encoding: 'column'`    |
| "xx的时间趋势，按yy分行"     | 行透视 + 时间序列 | yy 字段 `encoding: 'row'`，时间轴    |
| "xx的时间趋势，按yy分列"     | 列透视 + 时间序列 | yy 字段 `encoding: 'column'`，时间轴 |
| "各省份人口趋势对比"         | 行透视 + 时间序列 | 省份 `encoding: 'row'`，年份 xAxis   |
| "同时看多个指标"             | 度量组合图        | measures 使用不同 `parentId`         |
| "主副指标对比"               | 度量组合图        | 主副指标的 `parentId` 设计           |
| "分地区分年份分别展示"       | 行列透视          | 两个维度分别设为 row 和 column       |
| "收入成本一起，销量单独显示" | 透视+组合         | 组合透视维度 + 度量组合              |

---

### 步骤 3：查询图表配置项定义

**执行流程**：

```
1. 查询 ../top-keys/{chartType}.json 获取配置项信息
2. 必须读取 type-details/{ComponentName}.md 获取每个配置项的准确类型定义
3. 必须生成：chartType, dataset, dimensions, measures（四个核心字段）
4. 按需生成：其他配置项根据用户需求选择性添加
```

> ⚠️ **关键提醒**：**chartType 是 schema 的第一个必填字段**，必须在生成 dataset 之前就确定并写入！很多错误都源于遗漏这一步。

> > ⚠️ **重要规则（必须遵守）**：
>
> - **生成任何配置项前，必须先阅读其类型定义文件和约束规则文件**，不得凭记忆或猜测生成结构
> - **包括 `xAxis`、`yAxis`、`label`、`tooltip`、`legend` 等所有配置项**
> - **必须查阅 `rules/{ComponentName}.md` 中的约束条件**，确保生成的值符合验证规则
> - 类型定义（type-details）规定"结构"，约束规则（rules）规定"有效的取值"——两者都必须遵守

**3.1 查询图表支持的配置项**

查阅 `../top-keys/{chartType}.json`，获取该图表类型支持的配置项及其类型信息。提取关键信息：

- `dataset` 的 `componentName`（如 `Dataset`）
- `dimensions` 的 `componentName`（如 `ColumnDimension`）
- `measures` 的 `componentName`（如 `ColumnMeasure`）
- 其他可选配置项的 `componentName`（如 `label`、`tooltip`、`axes` 等）

**3.2 阅读类型定义与约束规则**（强制执行）

对于步骤 3.1 中提取的每个 `componentName`，**必须按以下顺序**阅读两个文件：

1. **`type-details/{ComponentName}.md`** → 数据结构的类型定义
2. **`rules/{ComponentName}.md`** → 约束条件、验证规则

如果没有对应的 rules 文件，使用 `type-details/{ComponentName}.md` 中的 Error cases 部分作为约束参考。

---

### 步骤 4：生成配置代码

基于步骤 3 中已读的类型定义和约束规则生成每个配置项。如果对某个字段不确定是否合法，说明步骤 3 有遗漏，应返回查阅。

**4.1 核心字段生成流程**（必须全部生成）

对于 `chartType`、`dataset`、`dimensions`、`measures` 四个核心字段，按以下流程生成：

#### 生成 chartType

chartType 是 schema 的第一个字段，必须先将步骤 2 中选择的图表类型写入。这是很多初始错误的根源——容易被遗漏或写错格式。

```javascript
// ✅ 正确：chartType 必须是步骤2中确定的图表类型字符串
{
  chartType: "column",  // 从步骤2中选择的类型
  // ... 其他字段
}
```

合法的 chartType 值参见 `chart-type-guide.md` 速查表。

---

#### 生成 dataset

dataset 是 TidyData 纯数组，这是最常见的错误来源之一——容易被包装成带 `id`/`name` 的对象。

```javascript
// ✅ 正确：dataset 直接是数组
dataset: [
  { category: "类目A", value: 100 },
  { category: "类目B", value: 200 },
]

// ❌ 错误：禁止包装成对象
dataset: { id: "xxx", data: [...] }  // 不要这样写
```

**关键**：每条记录是扁平对象，字段名即为 dimensions/measures 的 `id`。

#### 生成 dimensions

按三步法查阅对应的 type-details 和 rules 后生成：

```javascript
dimensions: [
  { id: 'category', encoding: 'xAxis' }, // 类目维度
  { id: 'type', encoding: 'color' }, // 颜色分组（可选）
  { id: 'region', encoding: 'row' }, // 行透视（可选）
]
```

- `id` 必须与 dataset 字段名完全一致（大小写敏感）
- `encoding` 值必须在 type-details 枚举范围内
- 透视用 `row`/`column`，坐标轴用 `xAxis`/`yAxis`

#### 生成 measures

按三步法查阅后生成：

```javascript
measures: [
  { id: 'value' }, // 基础配置
  { id: 'sales', alias: '销售额' }, // 带显示名称
  { id: 'revenue', parentId: 'primary' }, // 度量组合（可选）
]
```

- `id` 必须与 dataset 字段名完全一致
- 度量组合时，相同 `parentId` 的度量显示在同一子图
- 只使用 type-details 中定义的字段

**4.2 可选字段生成流程**

对于 `label`、`tooltip`、`xAxis`、`yAxis` 等可选配置项，仅在用户明确需求时按相同的三步法生成。跳过查阅是导致 "Invalid input" 验证错误的主要原因，因为很多字段的结构与直觉不同。

**典型陷阱**：坐标轴的 `title` 和 `label` 是对象而非字符串

```javascript
// ❌ 直觉写法（常见错误）
xAxis: { titleText: "销售额" }

// ✅ 查阅 type-details 后的正确写法
xAxis: {
  title: { visible: true, titleText: "销售额" }  // title 是 ITitle 对象
}
```

---

### 步骤 5：Schema 规范检查

生成的 schema 必须通过 zVSeed.safeParse 验证。核心约束详见 `../common-workflow.md#二核心-schema-约束`。

**自查清单**：

| 检查项          | 要求                                                          |
| --------------- | ------------------------------------------------------------- |
| chartType       | 字符串，值在 chart-type-guide.md 中，不是对象                 |
| dataset         | 纯数组，不是 `{id, name, data}` 对象                          |
| id 一致性       | dimensions/measures 的 id 与 dataset 字段名完全一致（大小写） |
| encoding 合法性 | encoding 值在该 chartType 支持范围内                          |
| 透视 vs 坐标轴  | 分面用 row/column，坐标轴用 xAxis/yAxis                       |
| 嵌套字段类型    | title、label、style 通常是对象不是字符串                      |
| theme           | 字符串，主题对象通过 `--theme` 脚本参数传入                   |

**自定义主题**：用户有配色需求时，schema 只写主题名（如 `theme: "enterprise-blue"`），主题对象通过 `--theme` 参数传入脚本。详见 `../theme-config-guide.md`。

---

### 步骤 6：输出可运行 HTML

使用 `scripts/generate_html.py` 脚本生成 HTML。脚本参数和用法详见 `../common-workflow.md#三输出-html-标准流程`。

**标准输出格式**：

````markdown
## 生成结果

**图表类型**：[chartType]  
**数据记录数**：[dataset.length] 条

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

> 有配色需求时，额外添加 `--theme '[主题配置 JSON]'` 参数。
