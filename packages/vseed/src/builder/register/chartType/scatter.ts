import { scatterAdvancedPipeline, scatterSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Scatter Chart 的构建管线。
 * 注册后，Builder 将支持构建 Scatter Chart 的 Spec 和 Advanced Config。
 */
export const registerScatter = () => {
  Builder.registerAdvancedPipeline('scatter', scatterAdvancedPipeline)
  Builder.registerSpecPipeline('scatter', scatterSpecPipeline)
}
