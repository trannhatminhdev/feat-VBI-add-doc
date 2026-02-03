import { areaAdvancedPipeline, areaSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Area Chart 的构建管线。
 * 注册后，Builder 将支持构建 Area Chart 的 Spec 和 Advanced Config。
 */
export const registerArea = () => {
  Builder.registerAdvancedPipeline('area', areaAdvancedPipeline)
  Builder.registerSpecPipeline('area', areaSpecPipeline)
}
