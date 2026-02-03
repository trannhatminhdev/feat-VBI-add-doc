import { columnPercentAdvancedPipeline, columnPercentSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Column Percent Chart 的构建管线。
 * 注册后，Builder 将支持构建 Column Percent Chart 的 Spec 和 Advanced Config。
 */
export const registerColumnPercent = () => {
  Builder.registerAdvancedPipeline('columnPercent', columnPercentAdvancedPipeline)
  Builder.registerSpecPipeline('columnPercent', columnPercentSpecPipeline)
}
