import { v4 as uuidv4 } from 'uuid'

export const id = {
  uuid: (): string => uuidv4(),
  resourceUUID: (): string => globalThis.crypto?.randomUUID?.() ?? uuidv4(),
}
