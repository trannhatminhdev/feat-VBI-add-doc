# RaceColumn 维度约束规则

## 基本要求

### 维度结构

- **最少维度数**：2 个维度（必需）
- **推荐维度数**：2-3 个维度

**维度作用**：

1. **Player 维度** → `encoding: 'player'`（时间播放维度，如年份、月份、日期，可以有多个）
2. **XAxis 维度** → `encoding: 'xAxis'`（排名类目，如国家、城市、产品）
3. **其他维度**（可选） → `encoding: 'color'` 等（分组维度）

### Player 维度规则

#### 何时使用 `encoding: 'player'`

- **支持多个维度** 使用 `encoding: 'player'`（映射到播放通道）
- 这些维度用于控制动态排名的播放时间轴
- **必须是有序数据**：时间字段（2020、2021、2022）、序列号（1、2、3、4）或日期（2024-01、2024-02）
- **禁止使用无序分类**：地区名称、产品名称等（这些应该用作 xAxis）

#### Player 维度的相关配置

- `id` 必须对应 dataset 中的字段名
- `encoding: 'player'` 时，**不应设置其他 encoding**（如 'xAxis'、'color'）
- 其他属性如 `alias` 可选

**示例**：

```javascript
dimensions: [
  {
    id: "year", // dataset 中的时间字段
    alias: "年份", // 显示别名
    encoding: "player", // 映射到播放通道，时间轴控制
  },
  // ... 其他维度
];
```

---

### XAxis 维度规则

#### 第二维度：排名类目

- 必须设置 `encoding: 'xAxis'` 用于显示排名对象
- 通常是分类数据：国家、城市、产品、运动员等
- **必须与 player 维度不同**

**示例**：

```javascript
{
  id: "country",           // 国家名，分类数据
  encoding: "xAxis"        // 映射到 X 轴，显示排名排序
}
```

---

### 多维度编码规则

#### 支持的 Encoding 组合

| 维度数 | 第一维度 | 第二维度         | 第三维度（可选）   |
| ------ | -------- | ---------------- | ------------------ |
| 2      | `player` | `xAxis`          | -                  |
| 3      | `player` | `xAxis`          | `color`            |
| 3+     | `player` | `xAxis` +`color` | `color` / `detail` |

#### encoding 的组合规则

**多个维度可以映射到 player**：

```javascript
// ✅ 正确：多个维度可以映射到 player
dimensions: [
  { id: "year", encoding: "player" },
  { id: "quarter", encoding: "player" }, // 支持多个 player 维度
];
```

**其他维度可以设置多个 encoding**（用逗号分隔）：

```javascript
// ✅ 正确：第二个维度既映射 xAxis（排名），又映射 color（分组）
dimensions: [
  { id: "year", encoding: "player" },
  { id: "country", encoding: "xAxis" }, // 同时用于排名和颜色分组
  { id: "country", encoding: "color" }, // 同时用于排名和颜色分组
];
```

**为什么允许多 encoding**：

- `xAxis` 控制排名排序和位置
- `color` 可以用于二次分组或标示属性
- 不会相互冲突，增强表达力

---

### 关键约束汇总

| 约束项                | 要求                                    | 示例                                       |
| --------------------- | --------------------------------------- | ------------------------------------------ | --- |
| **Player 维度支持**   | 支持多个维度映射到 player 通道          | 可以有多个维度使用 'player' encoding       |
| **Player 维度数据**   | 必须是有序数据（时间、序列）            | year: 2020, 2021, 2022 ✅ city: A, B, C ❌ |
| **其他维度编码**      | 非 player 维度支持与其他编码组合        | 可支持多编码（如 xAxis,color）             |
| **XAxis 维度**        | 第二个维度必须设置 `encoding: "xAxis"`  | `{ id: "country", encoding: "xAxis" }`     |
| **XAxis 与 Player**   | 两者必须来自不同维度                    | year → player, country → xAxis ✅          |
| **其他维度 encoding** | 可设置 color、detail、tooltip、label 等 | `{ id: "region", encoding: "color" }`      |     |

---

## 常见错误及修复

### 错误 1：Player 维度使用无序数据

**症状**：播放顺序混乱，图表抖动

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

### 错误 2：缺失 XAxis 维度

**症状**：排名不显示，无法看到排名项

```javascript
❌ 错误配置
dimensions: [
  { id: "year", encoding: "player" }
  // 缺少 xAxis 维度！
]
```

**修复**：

```javascript
✅ 正确配置
dimensions: [
  { id: "year", encoding: "player" },
  { id: "country", encoding: "xAxis" }  // 添加排名项维度
]
```
