import { raceBarSpecPipeline, raceBarAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 RaceBar Chart 的构建管线。
 * 注册后，Builder 将支持构建 RaceBar Chart 的 Spec。
 */
export const registerRaceBar = () => {
  Builder.registerAdvancedPipeline('raceBar', raceBarAdvancedPipeline)
  Builder.registerSpecPipeline('raceBar', raceBarSpecPipeline)
}
