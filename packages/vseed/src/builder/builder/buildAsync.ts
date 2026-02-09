import type { Spec } from 'src/types'
import type { Builder } from './builder'
import { InnerRowIndex } from 'src/dataReshape'

export const buildAsync = async (builder: Builder): Promise<Spec> => {
  const originalVseed = builder.vseed
  const originalDataset = originalVseed.dataset as any[]

  const datasetWithIndex = (originalDataset ?? []).map((item, index) => ({
    ...item,
    [InnerRowIndex]: index,
  }))

  // 创建新的 vseed 副本，替换 dataset
  const vseedWithIndex = {
    ...originalVseed,
    dataset: datasetWithIndex,
  }

  // 临时设置到 builder
  builder.vseed = vseedWithIndex

  const advancedVSeed = builder.buildAdvanced()

  // 恢复原始 vseed，避免污染
  builder.vseed = originalVseed

  if (!advancedVSeed) {
    throw new Error('advancedVSeed is null')
  }

  const spec = await builder.buildSpecAsync(advancedVSeed)
  return spec
}
