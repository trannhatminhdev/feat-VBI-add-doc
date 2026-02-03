import { donutAdvancedPipeline, donutSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Donut Chart 的构建管线。
 * 注册后，Builder 将支持构建 Donut Chart 的 Spec 和 Advanced Config。
 */
export const registerDonut = () => {
  Builder.registerAdvancedPipeline('donut', donutAdvancedPipeline)
  Builder.registerSpecPipeline('donut', donutSpecPipeline)
}
