import { v4 as uuidv4 } from 'uuid'

export const idGenerator = {
  generate: (): string => uuidv4(),
}
