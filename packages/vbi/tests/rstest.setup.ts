import { id } from 'src/utils'

let idCounter = 0
let resourceUUIDCounter = 0
const originalUuid = id.uuid
const originalResourceUUID = id.resourceUUID

beforeEach(() => {
  idCounter = 0
  resourceUUIDCounter = 0
  id.uuid = () => `id-${++idCounter}`
  id.resourceUUID = () => `uuid-${++resourceUUIDCounter}`
})

afterEach(() => {
  id.uuid = originalUuid
  id.resourceUUID = originalResourceUUID
})
