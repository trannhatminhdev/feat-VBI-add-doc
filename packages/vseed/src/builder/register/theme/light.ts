import { registerCustomTheme } from './custom'
import { lightTheme } from '../../../theme'

/**
 * @description 注册浅色主题 (Light Theme)。
 * 注册后，可以通过 Builder.getTheme('light') 获取。
 */
export const registerLightTheme = () => {
  registerCustomTheme('light', lightTheme())
}
