# Color 约束

## 核心规则

- **不支持渐变色映射**：color 属性主要用于定义调色板（colorScheme）或维度值映射（colorMapping），**不支持**基于 measure 值的动态渐变色

## colorScheme vs colorMapping 选择

### 使用 colorScheme 当：

- 用户要求通用配色变化，不指定特定字段
- 设置整体图表色调（如"用蓝色系"、"用暖色"）

```json
{ "color": { "colorScheme": ["#FFCDD2", "#F8BBD0", "#E1BEE7"] } }
```

### 使用 colorMapping 当（优先级高于 colorScheme）：

- 用户指定特定字段或类别的颜色
- 需要将维度值映射到指定颜色

```json
{
  "color": {
    "colorMapping": {
      "Category A": "#FFCDD2",
      "Category B": "#F8BBD0"
    }
  }
}
```

## 颜色数量建议

- **单维度图表**（饼图、柱状图等）：颜色数量 ≥ 维度字段的唯一值数量
- **多度量图表**：颜色数量 ≥ 度量数量

## colorMapping 键值规则

- 键必须是 dataset 中实际存在的维度值或 measure 字段 id
- 严格匹配大小写、空格、本地化文本
- **双轴图特殊规则**：键必须是 measures 层级结构中叶节点的字段 id
