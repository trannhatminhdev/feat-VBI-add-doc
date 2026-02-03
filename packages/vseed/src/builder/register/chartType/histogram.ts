import { histogramSpecPipeline, histogramAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Histogram Chart 的构建管线。
 * 注册后，Builder 将支持构建 Histogram Chart 的 Spec 和 Advanced Config。
 */
export const registerHistogram = () => {
  Builder._advancedPipelineMap['histogram'] = histogramAdvancedPipeline
  Builder._specPipelineMap['histogram'] = histogramSpecPipeline
}
