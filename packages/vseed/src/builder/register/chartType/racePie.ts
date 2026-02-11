import { racePieSpecPipeline, racePieAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 RacePie Chart 的构建管线。
 * 注册后，Builder 将支持构建 RacePie Chart 的 Spec。
 */
export const registerRacePie = () => {
  Builder.registerAdvancedPipeline('racePie', racePieAdvancedPipeline)
  Builder.registerSpecPipeline('racePie', racePieSpecPipeline)
}
