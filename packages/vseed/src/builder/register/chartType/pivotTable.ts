import { pivotTableAdvancedPipeline, pivotTableSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 Pivot Table Chart 的构建管线。
 * 注册后，Builder 将支持构建 Pivot Table Chart 的 Spec 和 Advanced Config。
 */
export const registerPivotTable = () => {
  Builder.registerAdvancedPipeline('pivotTable', pivotTableAdvancedPipeline)
  Builder.registerSpecPipeline('pivotTable', pivotTableSpecPipeline)
}
