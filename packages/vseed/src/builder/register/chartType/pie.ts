import { pieAdvancedPipeline, pieSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Pie Chart 的构建管线。
 * 注册后，Builder 将支持构建 Pie Chart 的 Spec 和 Advanced Config。
 */
export const registerPie = () => {
  Builder.registerAdvancedPipeline('pie', pieAdvancedPipeline)
  Builder.registerSpecPipeline('pie', pieSpecPipeline)
}
