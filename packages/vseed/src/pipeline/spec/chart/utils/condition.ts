import type { SpecPipelineContext, SpecPipe } from 'src/types'

export type Condition = (context: SpecPipelineContext) => boolean

export const condition = <T extends SpecPipe>(condition: Condition, truePipe: T, falsePipe: T): T => {
  return ((spec: any, context: SpecPipelineContext) => {
    if (condition(context)) {
      return truePipe(spec, context)
    }
    return falsePipe(spec, context)
  }) as T
}
