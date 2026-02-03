import { barParallelAdvancedPipeline, barParallelSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Bar Parallel Chart 的构建管线。
 * 注册后，Builder 将支持构建 Bar Parallel Chart 的 Spec 和 Advanced Config。
 */
export const registerBarParallel = () => {
  Builder.registerAdvancedPipeline('barParallel', barParallelAdvancedPipeline)
  Builder.registerSpecPipeline('barParallel', barParallelSpecPipeline)
}
