import { roseParallelAdvancedPipeline, roseParallelSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Rose Parallel Chart 的构建管线。
 * 注册后，Builder 将支持构建 Rose Parallel Chart 的 Spec 和 Advanced Config。
 */
export const registerRoseParallel = () => {
  Builder.registerAdvancedPipeline('roseParallel', roseParallelAdvancedPipeline)
  Builder.registerSpecPipeline('roseParallel', roseParallelSpecPipeline)
}
