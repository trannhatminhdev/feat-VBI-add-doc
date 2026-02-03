# registerCustomTheme

:::note{title=描述}
注册自定义主题。
:::

```ts
function registerCustomTheme(key: string, themeConfig:
    | CustomThemeConfig
    | ((props: { lightTheme: CustomThemeConfig; darkTheme: CustomThemeConfig }) => CustomThemeConfig)): void
```

**Parameters:**

- 主题的唯一标识符
- 主题配置对象，或者一个返回配置对象的函数
如果是函数，它将接收包含 lightTheme 和 darkTheme 的对象作为参数，方便基于现有主题进行扩展。

**Example:**

registerCustomTheme('myTheme', { ... });
// 或者基于浅色主题修改
registerCustomTheme('myTheme', ({ lightTheme }) => ({ ...lightTheme, ... }));

