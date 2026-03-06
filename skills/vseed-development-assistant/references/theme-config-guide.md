# 主题配置生成指南

本文档定义如何生成自定义主题配置对象，用于通过脚本替换 `generate.html` 模板中的 `{{custom_theme_config}}` 占位符。

---

## 配置结构

```javascript
const theme = {
  "theme-name": {
    isDark: boolean,              // 必需：继承深/浅色基础主题
    colorScheme: string[],        // 必需：分类颜色 8-15 个
    linearColorScheme: string[],  // 必需：渐变颜色 2-10 个
    positiveColor: string,        // 必需：正值/增长颜色
    negativeColor: string,        // 必需：负值/下降颜色
    backgroundColor?: string      // 可选：背景色
  }
};
```

---

## 字段说明

| 字段                | 类型     | 必需 | 约束                | 用途                               |
| ------------------- | -------- | ---- | ------------------- | ---------------------------------- |
| `isDark`            | boolean  | ✅   | `true` 或 `false`   | 决定继承深色或浅色基础主题         |
| `colorScheme`       | string[] | ✅   | 8-15 个十六进制颜色 | 多系列图表、分类数据、图例颜色     |
| `linearColorScheme` | string[] | ✅   | 2-10 个十六进制颜色 | 热力图渐变、散点图颜色编码         |
| `positiveColor`     | string   | ✅   | 十六进制 `#RRGGBB`  | 双轴图正值、K线上涨、增长指标      |
| `negativeColor`     | string   | ✅   | 十六进制 `#RRGGBB`  | 双轴图负值、K线下跌、下降指标      |
| `backgroundColor`   | string   | ❌   | 十六进制 `#RRGGBB`  | 图表背景，省略则使用基础主题默认值 |

---

## 生成规则

### 1. 选择基础主题

根据用户界面背景决定 `isDark` 值：

- 深色界面 → `isDark: true`
- 浅色界面 → `isDark: false`

### 2. 设计 colorScheme

- **数量**：8-15 个颜色
- **要求**：颜色间有足够对比度，便于区分不同系列
- **格式**：十六进制 `#RRGGBB`

### 3. 设计 linearColorScheme

- **数量**：2-10 个颜色
- **要求**：从浅到深或从深到浅的渐变序列
- **格式**：十六进制 `#RRGGBB`

### 4. 指定正负值颜色

- `positiveColor`：通常选择绿色系（如 `#2ca02c`、`#52c41a`）
- `negativeColor`：通常选择红色系（如 `#d62728`、`#ff4d4f`）

### 5. 验证配置

- 所有颜色值为有效十六进制格式
- 数组长度符合约束
- 不缺少必需字段

---

## 常见错误

| 错误类型                   | 示例                        | 修正           |
| -------------------------- | --------------------------- | -------------- |
| isDark 类型错误            | `isDark: "true"`            | `isDark: true` |
| 颜色格式错误               | `"red"` 或 `"rgb(255,0,0)"` | `"#ff0000"`    |
| colorScheme 数量不足       | 5 个颜色                    | 补充至 8-15 个 |
| linearColorScheme 数量不足 | 1 个颜色                    | 补充至 2-10 个 |
| 缺少必需字段               | 无 linearColorScheme        | 添加该字段     |

---

## 示例配置

### 企业蓝（浅色）

```javascript
const theme = {
  "enterprise-blue": {
    isDark: false,
    colorScheme: [
      "#003f87",
      "#0066cc",
      "#3399ff",
      "#66b3ff",
      "#99ccff",
      "#0052a3",
      "#004da8",
      "#003d82",
    ],
    linearColorScheme: ["#f7fbff", "#08519c"],
    positiveColor: "#2ca02c",
    negativeColor: "#d62728",
    backgroundColor: "#ffffff",
  },
};
```

### 深色彩虹

```javascript
const theme = {
  "dark-rainbow": {
    isDark: true,
    colorScheme: [
      "#ff6b6b",
      "#feca57",
      "#48dbfb",
      "#1dd1a1",
      "#5f27cd",
      "#00d2d3",
      "#ff9ff3",
      "#54a0ff",
    ],
    linearColorScheme: ["#2c3e50", "#ecf0f1"],
    positiveColor: "#1dd1a1",
    negativeColor: "#ff6b6b",
  },
};
```

### 热力图专用

```javascript
const theme = {
  "heatmap-gradient": {
    isDark: false,
    colorScheme: [
      "#313695",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#e0f3f8",
      "#fee090",
      "#fdae61",
      "#f46d43",
    ],
    linearColorScheme: [
      "#313695",
      "#4575b4",
      "#74add1",
      "#abd9e9",
      "#ffffbf",
      "#fee090",
      "#fdae61",
      "#f46d43",
      "#d73027",
    ],
    positiveColor: "#2ca02c",
    negativeColor: "#d62728",
  },
};
```

### 财富分布配色（浅色）

```javascript
const theme = {
  "wealth-distribution": {
    isDark: false,
    colorScheme: [
      "#4A90A4",
      "#9B6BA3",
      "#5BADC6",
      "#E8824E",
      "#3B7A8E",
      "#D97C3A",
      "#6E5B9F",
      "#48C3D8",
      "#2D6A7F",
      "#B85C2A",
      "#5E4B8F",
      "#38B3C8",
    ],
    linearColorScheme: [
      "#F5F5F0",
      "#D6DFE6",
      "#B8C9D9",
      "#8FADC3",
      "#6891AD",
      "#4A7897",
    ],
    positiveColor: "#2FB56A",
    negativeColor: "#E84B3C",
    backgroundColor: "#F5F5F0",
  },
};
```

### 工业金属配色（深色）

```javascript
const theme = {
  "industrial-metal": {
    isDark: true,
    colorScheme: [
      "#3D7EA6",
      "#5EB8D4",
      "#8AD4E8",
      "#B8E6F0",
      "#2A5F82",
      "#4A9FBF",
      "#6AC2D8",
      "#9AD8E8",
      "#1E4A66",
      "#3E8AAA",
      "#5EB2CA",
      "#7ECAE0",
    ],
    linearColorScheme: [
      "#1a2e3e",
      "#2a4e6e",
      "#3a6e8e",
      "#5a9eae",
      "#7abece",
      "#9adede",
    ],
    positiveColor: "#4ECB71",
    negativeColor: "#E85D4E",
    backgroundColor: "#3a3e42",
  },
};
```

---

## 脚本调用

生成 HTML 时通过 `--theme` 参数传入主题配置（注入 `{{custom_theme_config}}`）：

```bash
python scripts/generate_html.py \
  --template assets/template/generate.html \
  --title "图表标题" \
  --schema '{"chartType":"column",...}' \
  --theme '{"enterprise-blue":{...}}' \
  --output output.html
```

Schema 中通过 `theme` 字段指定使用的主题名称：

```json
{
  "chartType": "column",
  "theme": "enterprise-blue",
  ...
}
```
