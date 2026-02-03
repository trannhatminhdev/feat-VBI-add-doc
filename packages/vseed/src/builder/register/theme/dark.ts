import { darkTheme } from '../../../theme'
import { registerCustomTheme } from './custom'

/**
 * @description 注册深色主题 (Dark Theme)。
 * 注册后，可以通过 Builder.getTheme('dark') 获取。
 */
export const registerDarkTheme = () => {
  registerCustomTheme('dark', darkTheme())
}
