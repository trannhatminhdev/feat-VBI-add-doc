import { funnelAdvancedPipeline, funnelSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Funnel Chart 的构建管线。
 * 注册后，Builder 将支持构建 Funnel Chart 的 Spec 和 Advanced Config。
 */
export const registerFunnel = () => {
  Builder.registerAdvancedPipeline('funnel', funnelAdvancedPipeline)
  Builder.registerSpecPipeline('funnel', funnelSpecPipeline)
}
