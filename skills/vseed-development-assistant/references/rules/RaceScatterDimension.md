# RaceScatterDimension 维度约束规则

## 基本要求

### 维度结构

- **最少维度数**：1 个维度（必需）
- **推荐维度数**：2-3 个维度

**维度作用**：

1. **Player 维度** → `encoding: 'player'`（时间播放维度，如年份、月份、日期，支持多个）
2. **其他维度**（可选） → `encoding: 'color'` 或 `'detail'`（用于识别不同实体）

### Player 维度规则

#### 何时使用 `encoding: 'player'`

- **支持多个维度** 使用 `encoding: 'player'`（映射到播放通道）
- 这些维度用于控制动态散点的时间播放轴
- **必须是有序数据**：时间字段（2020、2021、2022）、序列号（1、2、3、4）或日期（2024-01、2024-02）
- **禁止使用无序分类**：地区名称、产品名称等

#### Player 维度的相关配置

- `id` 必须对应 dataset 中的字段名
- `encoding: 'player'` 时，**不应设置其他 encoding**（如 'color'、'detail'）
- 其他属性如 `alias` 可选

**示例**：

```javascript
dimensions: [
  {
    id: "year", // dataset 中的时间字段
    alias: "年份", // 显示别名
    encoding: "player", // 映射到播放通道，时间轴控制
  },
];
```

---

### 其他维度规则

#### 用于实体识别的维度

在多实体（如多国家、多产品）的动态散点图中，需要使用维度来区分不同实体：

```javascript
dimensions: [
  { id: "year", encoding: "player" },
  { id: "country", encoding: "color" }, // 用颜色区分不同国家
];
```

**支持的 Encoding**：

- `color`：最常用，用颜色区分不同实体（推荐）
- `detail`：用于详细信息（可选）
- `tooltip`：悬停时显示额外信息（可选）
- `label`：数据标签显示（可选）

#### 多个非 Player 维度

如果需要更多维度来区分实体：

```javascript
dimensions: [
  { id: "year", encoding: "player" },
  { id: "country", encoding: "color" }, // 国家用颜色
  { id: "continent", encoding: "detail" }, // 大陆信息在详情中
];
```

---

### 关键约束汇总

| 约束项                   | 要求                                    | 示例                                       |
| ------------------------ | --------------------------------------- | ------------------------------------------ |
| **Player 维度支持**      | 支持多个维度映射到 player 通道          | 可以有多个维度使用 'player' encoding       |
| **Player 维度数据**      | 必须是有序数据（时间、序列）            | year: 2020, 2021, 2022 ✅ city: A, B, C ❌ |
| **其他维度编码**         | 非 player 维度支持与其他编码组合        | 可支持多编码（如 color,detail）            |
| **其他维度 encoding**    | 可设置 color、detail、tooltip、label 等 | `{ id: "country", encoding: "color" }`     |
| **维度重复**             | 不得在多个维度中使用同一 dataset 字段   | 每个 id 仅用一次                           |
| **非 Player 维度最少数** | 通常至少 1 个（用于实体识别）           | `dimensions` 最少包含 2 个维度             |

---

## 常见错误及修复

### 错误 1：Player 维度使用无序数据

**症状**：播放顺序混乱，轨迹跳跃

```javascript
❌ 错误配置
{
  id: "country",         // 无序分类！
  encoding: "player"
}
```

**修复**：

```javascript
✅ 正确配置
{
  id: "year",           // 有序时间字段
  encoding: "player"
}
```

---

### 错误 2：缺少实体识别维度

**症状**：无法区分不同数据序列，图表混乱

```javascript
❌ 错误配置
dimensions: [
  { id: "year", encoding: "player" }  // 没有维度来区分不同国家
]
// 多个国家的轨迹混在一起
```

**修复**：

```javascript
✅ 正确配置
dimensions: [
  { id: "year", encoding: "player" },
  { id: "country", encoding: "color" }  // 用颜色区分国家
]
```
