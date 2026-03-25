import * as Y from 'yjs'
import { getConnector } from '../connector'

export const getBuilderSchema = async (dsl: Y.Map<any>) => {
  const connectorId = dsl.get('connectorId')
  const connector = await getConnector(connectorId)
  return connector.discoverSchema()
}
