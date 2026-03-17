import { connectorMap, getConnector, registerConnector } from 'src/builder/connector'
import { fromVBIDSLInput } from './from/from-vbi-dsl-input'
import { generateEmptyDSL } from './generate-empty-dsl'

export const createVBI = () => {
  return {
    connectorMap,
    registerConnector,
    getConnector,
    generateEmptyDSL,
    from: fromVBIDSLInput,
    create: fromVBIDSLInput,
  }
}
