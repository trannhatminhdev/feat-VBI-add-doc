import type { Spec } from 'src/types'
import type { Builder } from './builder'

export const buildAsync = async (builder: Builder): Promise<Spec> => {
  const advancedVSeed = builder.buildAdvanced()
  if (!advancedVSeed) {
    throw new Error('advancedVSeed is null')
  }
  const spec = await builder.buildSpecAsync(advancedVSeed)
  return spec
}
