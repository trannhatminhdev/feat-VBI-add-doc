import { columnAdvancedPipeline, columnSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Column Chart 的构建管线。
 * 注册后，Builder 将支持构建 Column Chart 的 Spec 和 Advanced Config。
 */
export const registerColumn = () => {
  Builder._advancedPipelineMap['column'] = columnAdvancedPipeline
  Builder._specPipelineMap['column'] = columnSpecPipeline
}
