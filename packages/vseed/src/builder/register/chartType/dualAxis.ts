import { dualAxisAdvancedPipeline, dualAxisSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Dual Axis Chart 的构建管线。
 * 注册后，Builder 将支持构建 Dual Axis Chart 的 Spec 和 Advanced Config。
 */
export const registerDualAxis = () => {
  Builder.registerAdvancedPipeline('dualAxis', dualAxisAdvancedPipeline)
  Builder.registerSpecPipeline('dualAxis', dualAxisSpecPipeline)
}
