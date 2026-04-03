# 10. useVBIBuilder — 全局配置（locale / theme / limit）

## 签名

```ts
const {
  locale, // DemoLocale，当前语言 ('zh-CN' | 'en-US')
  theme, // DemoTheme，当前主题 ('light' | 'dark')
  limit, // number，数据行数限制
  connectorId, // string，当前 Connector ID
  setLocale, // (locale: DemoLocale) => void
  setTheme, // (theme: DemoTheme) => void
  setLimit, // (limit: number) => void
} = useVBIBuilder(builder)
```

## 源码

`practices/standard/src/hooks/useVBIBuilder.ts`

## 用法示例

### 切换语言

```ts
setLocale('zh-CN') // 中文
setLocale('en-US') // 英文
```

### 切换主题

```ts
setTheme('light') // 浅色主题
setTheme('dark') // 深色主题
```

### 设置数据限制

```ts
setLimit(500) // 仅返回 500 行数据
setLimit(1000) // 默认限制
```

---

## 常量定义

`practices/standard/src/constants/builder.ts`

```ts
export const DEMO_DEFAULT_LOCALE = 'zh-CN'
export const DEMO_DEFAULT_THEME = 'light'
export const DEMO_DEFAULT_LIMIT = 1000
export const DEMO_MAX_LIMIT = 1000

export const DEMO_SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const
export const DEMO_SUPPORTED_THEMES = ['light', 'dark'] as const

export type DemoLocale = 'zh-CN' | 'en-US'
export type DemoTheme = 'light' | 'dark'
```

---

## 实现细节

- 状态订阅使用 `builder.doc.on('update', ...)`，通过 `builder.dsl.toJSON()` 同步 DSL 中的 `locale`/`theme`/`limit` 值
- `setLimit` 内部调用 `normalizeLimit()`，自动将值四舍五入并限制最小为 1
- `setLocale` / `setTheme` / `setLimit` 分别调用 `builder.locale.setLocale()` / `builder.theme.setTheme()` / `builder.limit.setLimit()`
- 初始值从 DSL JSON 快照同步，无默认值时回退到常量默认值

---

## 注意事项

- `limit` 影响的是 SQL 查询返回的行数，不是渲染的行数
- 主题切换会同时影响 Toolbar 和 VSeed 渲染结果
- 语言切换影响数字格式化（如千分位分隔符）等国际化显示
