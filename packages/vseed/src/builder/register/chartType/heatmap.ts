import { heatmapAdvancedPipeline, heatmapSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Heatmap Chart 的构建管线。
 * 注册后，Builder 将支持构建 Heatmap Chart 的 Spec 和 Advanced Config。
 */
export const registerHeatmap = () => {
  Builder.registerAdvancedPipeline('heatmap', heatmapAdvancedPipeline)
  Builder.registerSpecPipeline('heatmap', heatmapSpecPipeline)
}
