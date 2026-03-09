# fieldFormatMap 约束

## 用途

用于字段值的数值格式化，替代在轴配置中设置格式化。

## 配置结构

```typescript
type FieldFormatMap = Record<string, NumFormat>

interface NumFormat {
  type?: 'number' | 'percent' | 'permille' | 'scientific' // 默认 'number'
  ratio?: number // 比例系数，默认 1
  symbol?: string // 符号，如 "万"、"K"、"%"
  thousandSeparator?: boolean // 千分位分隔符，默认 true
  suffix?: string // 后缀
  prefix?: string // 前缀
  fractionDigits?: number // 小数位数，默认 2
  significantDigits?: number // 有效位数（优先级高于 fractionDigits）
}
```

## 示例

```json
{
  "fieldFormatMap": {
    "revenue": {
      "ratio": 10000,
      "symbol": "万",
      "fractionDigits": 1
    },
    "rate": {
      "type": "percent",
      "fractionDigits": 2
    }
  }
}
```

转换效果：

- `100000` → `10万`（ratio:10000, symbol:"万"）
- `0.1234` → `12.34%`（type:"percent"）
