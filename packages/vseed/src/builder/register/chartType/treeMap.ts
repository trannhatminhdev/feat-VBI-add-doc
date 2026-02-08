import { treeMapAdvancedPipeline, treeMapSpecPipeline } from '../../../pipeline'
import { Builder } from '../../builder'

/**
 * @description 注册 TreeMap Chart 的构建管线。
 * 注册后，Builder 将支持构建 TreeMap Chart 的 Spec 和 Advanced Config。
 */
export const registerTreeMap = () => {
  Builder.registerAdvancedPipeline('treeMap', treeMapAdvancedPipeline)
  Builder.registerSpecPipeline('treeMap', treeMapSpecPipeline)
}
