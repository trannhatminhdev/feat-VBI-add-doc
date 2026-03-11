import { isSelectItem } from 'src/sql-builder/utils'

describe('utils', () => {
  it('isSelectItem', () => {
    type T = { a: number; b: string }
    expect(isSelectItem<T>('a')).toBe(false)
    expect(isSelectItem<T>({ field: 'a' })).toBe(true)
  })
})
