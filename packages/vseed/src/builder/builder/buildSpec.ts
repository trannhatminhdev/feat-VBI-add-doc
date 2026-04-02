import type { AdvancedVSeed, Pipe, Spec, SpecPipelineContext } from 'src/types'
import { Builder } from './builder'
import { execPipeline } from '../../pipeline'
import { intl } from 'src/i18n'

export const buildSpec = (builder: Builder, advancedVSeed: AdvancedVSeed): Spec => {
  const start = typeof performance !== 'undefined' ? performance.now() : Date.now()

  const { chartType } = builder.vseed

  const pipeline = Builder.getSpecPipeline(chartType)
  if (!pipeline) {
    throw new Error(
      `please invoke registerAll or register ${chartType} before build, no spec pipeline for chartType ${chartType}`,
    )
  }

  const context: SpecPipelineContext = {
    vseed: builder.vseed,
    advancedVSeed,
  }
  if (builder.locale) {
    intl.setLocale(builder.locale)
  }

  try {
    const spec = execPipeline<Spec, SpecPipelineContext>(pipeline as Array<Pipe<Spec, SpecPipelineContext>>, context)
    builder.spec = spec as Spec
    return spec as Spec
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    throw new Error(`buildSpec error: ${(e as Error).message}`)
  } finally {
    const end = typeof performance !== 'undefined' ? performance.now() : Date.now()
    builder.performance['buildSpec'] = `${(end - start).toFixed(4)}ms`
  }
}
