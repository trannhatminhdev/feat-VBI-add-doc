import { boxplotAdvancedPipeline, boxplotSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Box Plot Chart 的构建管线。
 * 注册后，Builder 将支持构建 Box Plot Chart 的 Spec 和 Advanced Config。
 */
export const registerBoxPlot = () => {
  Builder._advancedPipelineMap['boxPlot'] = boxplotAdvancedPipeline
  Builder._specPipelineMap['boxPlot'] = boxplotSpecPipeline
}
