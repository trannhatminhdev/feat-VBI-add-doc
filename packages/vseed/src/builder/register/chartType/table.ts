import { tableAdvancedPipeline, tableSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Table Chart 的构建管线。
 * 注册后，Builder 将支持构建 Table Chart 的 Spec 和 Advanced Config。
 */
export const registerTable = () => {
  Builder._advancedPipelineMap['table'] = tableAdvancedPipeline
  Builder._specPipelineMap['table'] = tableSpecPipeline
}
