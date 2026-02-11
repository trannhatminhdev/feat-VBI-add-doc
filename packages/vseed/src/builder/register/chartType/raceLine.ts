import { raceLineSpecPipeline, raceLineAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 RaceLine Chart 的构建管线。
 * 注册后，Builder 将支持构建 RaceLine Chart 的 Spec。
 */
export const registerRaceLine = () => {
  Builder.registerAdvancedPipeline('raceLine', raceLineAdvancedPipeline)
  Builder.registerSpecPipeline('raceLine', raceLineSpecPipeline)
}
