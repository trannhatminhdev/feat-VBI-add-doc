import { raceDonutSpecPipeline, raceDonutAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 RaceDonut Chart 的构建管线。
 * 注册后，Builder 将支持构建 RaceDonut Chart 的 Spec。
 */
export const registerRaceDonut = () => {
  Builder.registerAdvancedPipeline('raceDonut', raceDonutAdvancedPipeline)
  Builder.registerSpecPipeline('raceDonut', raceDonutSpecPipeline)
}
