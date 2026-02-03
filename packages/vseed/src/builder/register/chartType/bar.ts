import { barAdvancedPipeline, barSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Bar Chart 的构建管线。
 * 注册后，Builder 将支持构建 Bar Chart 的 Spec 和 Advanced Config。
 */
export const registerBar = () => {
  Builder.registerAdvancedPipeline('bar', barAdvancedPipeline)
  Builder.registerSpecPipeline('bar', barSpecPipeline)
}
