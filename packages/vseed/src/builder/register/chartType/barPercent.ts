import { barPercentAdvancedPipeline, barPercentSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Bar Percent Chart 的构建管线。
 * 注册后，Builder 将支持构建 Bar Percent Chart 的 Spec 和 Advanced Config。
 */
export const registerBarPercent = () => {
  Builder._advancedPipelineMap['barPercent'] = barPercentAdvancedPipeline
  Builder._specPipelineMap['barPercent'] = barPercentSpecPipeline
}
