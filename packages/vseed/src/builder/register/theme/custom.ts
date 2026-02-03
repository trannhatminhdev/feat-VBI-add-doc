import type { CustomThemeConfig } from 'src/types'
import { Builder } from '../../builder'
import { darkTheme, lightTheme } from '../../../theme'

/**
 * @description 注册自定义主题。
 * @param key 主题的唯一标识符
 * @param themeConfig 主题配置对象，或者一个返回配置对象的函数
 * 如果是函数，它将接收包含 lightTheme 和 darkTheme 的对象作为参数，方便基于现有主题进行扩展。
 * @example
 * registerCustomTheme('myTheme', { ... });
 * // 或者基于浅色主题修改
 * registerCustomTheme('myTheme', ({ lightTheme }) => ({ ...lightTheme, ... }));
 */
export const registerCustomTheme = (
  key: string,
  themeConfig:
    | CustomThemeConfig
    | ((props: { lightTheme: CustomThemeConfig; darkTheme: CustomThemeConfig }) => CustomThemeConfig),
) => {
  const customTheme =
    typeof themeConfig === 'function' ? themeConfig({ lightTheme: lightTheme(), darkTheme: darkTheme() }) : themeConfig
  Builder._themeMap[key] = customTheme
}
