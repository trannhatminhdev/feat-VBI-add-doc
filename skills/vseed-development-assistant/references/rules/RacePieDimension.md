# RacePieDimension 配置约束与规则

> **适用图表类型**：`racePie`（动态饼图）

本文档说明 `racePie` 图表类型的 **dimensions 配置规则与约束**。

---

## 类型定义

详见 [type-details/RacePieDimension.md](../type-details/RacePieDimension.md)

---

## 维度结构

- **最少维度数**：2 个维度（必需）
- **推荐维度数**：2-3 个维度

**维度作用**：

1. **Player 维度** → `encoding: 'player'`（时间播放维度，如年份、月份、日期，支持多个）
2. **分类维度** → `encoding: 'color'`（扇区分类，如产品类别、地区，必需）
3. **其他维度**（可选） → `encoding: 'detail'`、`'tooltip'` 等（额外信息）

---

## Player 维度规则

### 何时使用 `encoding: 'player'`

- **支持多个维度** 使用 `encoding: 'player'`（映射到播放通道）
- 这些维度用于控制动态饼图的播放时间轴
- **必须是有序数据**：时间字段（2020、2021、2022）、序列号（1、2、3、4）或日期（2024-01、2024-02）
- **禁止使用无序分类**：产品名称、类别名称等（这些应该用作 color）

**示例**：

```javascript
// ✅ 正确：年份作为 player 维度
dimensions: [
  { id: 'year', encoding: 'player' }, // 有序时间数据
  { id: 'category', encoding: 'color' }, // 扇区分类
]

// ❌ 错误：无序分类作为 player 维度
dimensions: [
  { id: 'product', encoding: 'player' }, // 错误！产品名称无序
  { id: 'region', encoding: 'color' },
]
```

---

## 分类维度规则

### 何时使用 `encoding: 'color'`

- **至少需要一个维度** 使用 `encoding: 'color'`
- 用于区分饼图的不同扇区
- 通常是分类字段（产品类别、地区、用户群体等）

**示例**：

```javascript
// ✅ 正确：分类维度映射到 color
dimensions: [
  { id: 'year', encoding: 'player' },
  { id: 'category', encoding: 'color' }, // 扇区分类
]

// ❌ 错误：缺少 color 维度
dimensions: [
  { id: 'year', encoding: 'player' },
  // 缺少分类维度！饼图无法显示扇区
]
```

---

## 多编码支持

### encoding 的组合规则

**多个维度可以映射到 player**：

```javascript
// ✅ 正确：多个维度可以映射到 player
dimensions: [
  { id: 'year', encoding: 'player' },
  { id: 'quarter', encoding: 'player' }, // 支持多个 player 维度
]
```

**其他维度可以设置多个 encoding**（用逗号分隔）：

```javascript
// ✅ 正确：分类维度既映射 color（扇区），又映射 tooltip（提示）
dimensions: [
  { id: 'year', encoding: 'player' },
  { id: 'category', encoding: 'color,tooltip' }, // 同时用于扇区和提示
]
```

---

## 核心约束总结

| 约束项              | 要求                             | 示例                                           |
| ------------------- | -------------------------------- | ---------------------------------------------- |
| **Player 维度支持** | 支持多个维度映射到 player 通道   | 可以有多个维度使用 'player' encoding           |
| **Player 维度数据** | 必须是有序数据（时间、序列）     | year: 2020, 2021, 2022 ✅ category: A, B, C ❌ |
| **分类维度**        | 至少需要一个 color 维度          | `{ id: "category", encoding: "color" }`        |
| **其他维度编码**    | 非 player 维度支持与其他编码组合 | 可支持多编码（如 color,tooltip）               |

---

## 常见错误及修复

### 错误 1：Player 维度使用无序数据

**症状**：播放器时间轴顺序混乱或不正确

```javascript
❌ 错误配置
dimensions: [
  { id: "product", encoding: "player" },  // 错误！产品名称无序
  { id: "region", encoding: "color" }
]
```

**修复**：

```javascript
✅ 正确配置
dimensions: [
  { id: "year", encoding: "player" },     // 使用年份等有序数据
  { id: "product", encoding: "color" }    // 产品作为扇区分类
]
```

---

### 错误 2：缺少分类维度

**症状**：饼图无法显示扇区，或所有数据合并成一个扇区

```javascript
❌ 错误配置
dimensions: [
  { id: "year", encoding: "player" }
  // 缺少 color 维度！
]
```

**修复**：

```javascript
✅ 正确配置
dimensions: [
  { id: "year", encoding: "player" },
  { id: "category", encoding: "color" }  // 添加扇区分类维度
]
```

---

## 数据要求

**数据格式**（TidyData）：

```javascript
// ✅ 正确的数据结构
dataset: [
  { year: '2020', category: '产品A', sales: 100 },
  { year: '2020', category: '产品B', sales: 200 },
  { year: '2020', category: '产品C', sales: 150 },
  { year: '2021', category: '产品A', sales: 120 },
  { year: '2021', category: '产品B', sales: 180 },
  { year: '2021', category: '产品C', sales: 160 },
]

// dimensions 配置
dimensions: [
  { id: 'year', encoding: 'player' }, // 对应 dataset 中的 year 字段
  { id: 'category', encoding: 'color' }, // 对应 dataset 中的 category 字段
]

// measures 配置
measures: [
  { id: 'sales' }, // 对应 dataset 中的 sales 字段（扇区大小）
]
```

**关键要求**：

- ✅ Player 维度字段（如 year）在数据中必须有序排列
- ✅ 每个时间点必须包含所有分类的数据（完整覆盖）
- ✅ 分类维度字段（如 category）用于区分扇区
- ❌ 数据不能有缺失的时间点或分类
