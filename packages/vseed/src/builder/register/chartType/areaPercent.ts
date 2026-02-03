import { areaPercentAdvancedPipeline, areaPercentSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Area Percent Chart 的构建管线。
 * 注册后，Builder 将支持构建 Area Percent Chart 的 Spec 和 Advanced Config。
 */
export const registerAreaPercent = () => {
  Builder.registerAdvancedPipeline('areaPercent', areaPercentAdvancedPipeline)
  Builder.registerSpecPipeline('areaPercent', areaPercentSpecPipeline)
}
