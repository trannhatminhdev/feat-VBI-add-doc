import { sunburstAdvancedPipeline, sunburstSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Sunburst Chart 的构建管线。
 * 注册后，Builder 将支持构建 Sunburst Chart 的 Spec 和 Advanced Config。
 */
export const registerSunburst = () => {
  Builder.registerAdvancedPipeline('sunburst', sunburstAdvancedPipeline)
  Builder.registerSpecPipeline('sunburst', sunburstSpecPipeline)
}
