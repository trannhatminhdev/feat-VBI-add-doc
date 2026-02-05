import { raceColumnSpecPipeline, raceColumnAdvancedPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 RaceColumn Chart 的构建管线。
 * 注册后，Builder 将支持构建 RaceColumn Chart 的 Spec。
 */
export const registerRaceColumn = () => {
  Builder.registerAdvancedPipeline('raceColumn', raceColumnAdvancedPipeline)
  Builder.registerSpecPipeline('raceColumn', raceColumnSpecPipeline)
}
