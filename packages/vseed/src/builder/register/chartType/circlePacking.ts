import { circlePackingAdvancedPipeline, circlePackingSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 CirclePacking Chart 的构建管线。
 * 注册后，Builder 将支持构建 CirclePacking Chart 的 Spec 和 Advanced Config。
 */
export const registerCirclePacking = () => {
  Builder.registerAdvancedPipeline('circlePacking', circlePackingAdvancedPipeline)
  Builder.registerSpecPipeline('circlePacking', circlePackingSpecPipeline)
}
