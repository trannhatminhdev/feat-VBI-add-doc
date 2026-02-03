import { radarAdvancedPipeline, radarSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Radar Chart 的构建管线。
 * 注册后，Builder 将支持构建 Radar Chart 的 Spec 和 Advanced Config。
 */
export const registerRadar = () => {
  Builder._advancedPipelineMap['radar'] = radarAdvancedPipeline
  Builder._specPipelineMap['radar'] = radarSpecPipeline
}
