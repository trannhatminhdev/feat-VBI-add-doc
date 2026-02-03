import { columnParallelAdvancedPipeline, columnParallelSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Column Parallel Chart 的构建管线。
 * 注册后，Builder 将支持构建 Column Parallel Chart 的 Spec 和 Advanced Config。
 */
export const registerColumnParallel = () => {
  Builder.registerAdvancedPipeline('columnParallel', columnParallelAdvancedPipeline)
  Builder.registerSpecPipeline('columnParallel', columnParallelSpecPipeline)
}
