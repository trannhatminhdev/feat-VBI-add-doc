import { idGenerator } from 'src/utils'

let idCounter = 0
const originalGenerate = idGenerator.generate

beforeEach(() => {
  idCounter = 0
  idGenerator.generate = () => `id-${++idCounter}`
})

afterEach(() => {
  idGenerator.generate = originalGenerate
})
