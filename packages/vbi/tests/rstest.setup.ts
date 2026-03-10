import { id } from 'src/utils'

let idCounter = 0
const originalUuid = id.uuid

beforeEach(() => {
  idCounter = 0
  id.uuid = () => `id-${++idCounter}`
})

afterEach(() => {
  id.uuid = originalUuid
})
