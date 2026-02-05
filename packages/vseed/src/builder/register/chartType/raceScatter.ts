import { raceScatterSpecPipeline, raceScatterAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 RaceScatter Chart 的构建管线。
 * 注册后，Builder 将支持构建 RaceScatter Chart 的 Spec。
 */
export const registerRaceScatter = () => {
  Builder.registerAdvancedPipeline('raceScatter', raceScatterAdvancedPipeline)
  Builder.registerSpecPipeline('raceScatter', raceScatterSpecPipeline)
}
