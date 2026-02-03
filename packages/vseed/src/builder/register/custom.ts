import type { AdvancedPipe, ChartType, SpecPipe } from 'src/types'
import { Builder } from '../builder'

/**
 * @description 更新指定图表类型的 Advanced Pipeline。
 * 允许用户注入自定义的处理逻辑到高级配置构建流程中。
 * @param chartType 图表类型
 * @param advancedPipe 新的 Advanced Pipe
 */
export const updateAdvanced = (chartType: ChartType, advancedPipe: AdvancedPipe) => {
  Builder.updateAdvanced(chartType, advancedPipe)
}
/**
 * @description 更新指定图表类型的 Spec Pipeline。
 * 允许用户注入自定义的处理逻辑到最终 Spec 构建流程中。
 * @param chartType 图表类型
 * @param specPipe 新的 Spec Pipe
 */
export const updateSpec = (chartType: ChartType, specPipe: SpecPipe) => {
  Builder.updateSpec(chartType, specPipe)
}
