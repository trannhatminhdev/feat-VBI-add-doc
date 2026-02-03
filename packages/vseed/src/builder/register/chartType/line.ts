import { lineAdvancedPipeline, lineSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Line Chart 的构建管线。
 * 注册后，Builder 将支持构建 Line Chart 的 Spec 和 Advanced Config。
 */
export const registerLine = () => {
  Builder._advancedPipelineMap['line'] = lineAdvancedPipeline
  Builder._specPipelineMap['line'] = lineSpecPipeline
}
