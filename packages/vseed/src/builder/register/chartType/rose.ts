import { roseAdvancedPipeline, roseSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Rose Chart 的构建管线。
 * 注册后，Builder 将支持构建 Rose Chart 的 Spec 和 Advanced Config。
 */
export const registerRose = () => {
  Builder.registerAdvancedPipeline('rose', roseAdvancedPipeline)
  Builder.registerSpecPipeline('rose', roseSpecPipeline)
}
