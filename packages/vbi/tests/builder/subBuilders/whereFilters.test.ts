import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('WhereFiltersBuilder', () => {
  test('addWhereFilter', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'category',
          operator: 'eq',
          value: 'Electronics',
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('addWhereFilter callback', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.whereFilters
      .add('region', (node) => {
        node.setOperator('eq').setValue('Beijing')
      })
      .add('sales', (node) => {
        node.setOperator('gt').setValue(1000)
      })

    expect(builder.build()).toEqual({
      dimensions: [],
      whereFilters: [
        {
          field: 'region',
          operator: 'eq',
          value: 'Beijing',
        },
        {
          field: 'sales',
          operator: 'gt',
          value: 1000,
        },
      ],
      havingFilters: [],
      measures: [],
    })
  })

  test('removeWhereFilter', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', operator: 'eq', value: 'Electronics' },
        { field: 'region', operator: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.remove('category')

    expect(builder.build().whereFilters).toEqual([{ field: 'region', operator: 'eq', value: 'Beijing' }])
  })

  test('removeWhereFilter not found returns this', () => {
    const dsl = { whereFilters: [{ field: 'category', operator: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const result = builder.whereFilters.remove('notExist')

    expect(result).toBe(builder.whereFilters)
    expect(builder.build().whereFilters).toEqual([{ field: 'category', operator: 'eq', value: 'Electronics' }])
  })

  test('updateWhereFilter', () => {
    const dsl = { whereFilters: [{ field: 'category', operator: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.update('category', (node) => {
      node.setOperator('in').setValue(['Electronics', 'Books'])
    })

    expect(builder.build().whereFilters).toEqual([
      { field: 'category', operator: 'in', value: ['Electronics', 'Books'] },
    ])
  })

  test('updateWhereFilter throws error if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.whereFilters.update('notExist', (node) => {
        node.setOperator('eq').setValue('test')
      })
    }).toThrow('Where filter with field notExist not found')
  })

  test('findWhereFilter', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', operator: 'eq', value: 'Electronics' },
        { field: 'region', operator: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')

    expect(node?.getField()).toBe('category')
    expect(node?.toJson()).toEqual({ field: 'category', operator: 'eq', value: 'Electronics' })
  })

  test('findWhereFilter returns undefined if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('notExist')

    expect(node).toBeUndefined()
  })

  test('findAllWhereFilters', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', operator: 'eq', value: 'Electronics' },
        { field: 'region', operator: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const nodes = builder.whereFilters.findAll()

    expect(nodes.length).toBe(2)
    expect(nodes[0].getField()).toBe('category')
    expect(nodes[1].getField()).toBe('region')
  })

  test('findAllWhereFilters returns empty array when no filters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const nodes = builder.whereFilters.findAll()

    expect(nodes).toEqual([])
  })

  test('clearWhereFilters', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', operator: 'eq', value: 'Electronics' },
        { field: 'region', operator: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters.clear()

    expect(builder.build().whereFilters).toEqual([])
  })

  test('toJson', () => {
    const dsl = {
      whereFilters: [
        { field: 'category', operator: 'eq', value: 'Electronics' },
        { field: 'region', operator: 'eq', value: 'Beijing' },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.whereFilters.toJson()

    expect(json).toEqual([
      { field: 'category', operator: 'eq', value: 'Electronics' },
      { field: 'region', operator: 'eq', value: 'Beijing' },
    ])
  })

  test('toJson returns empty array when no filters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.whereFilters.toJson()

    expect(json).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }
    const unobserve = builder.whereFilters.observe(callback)

    builder.whereFilters.add('category', (node) => {
      node.setOperator('eq').setValue('Electronics')
    })

    expect(callCount).toBe(1)

    unobserve()

    builder.whereFilters.add('region', (node) => {
      node.setOperator('eq').setValue('Beijing')
    })

    expect(callCount).toBe(1)
  })

  test('WhereFilterNodeBuilder getField', () => {
    const dsl = { whereFilters: [{ field: 'category', operator: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')

    expect(node?.getField()).toBe('category')
  })

  test('WhereFilterNodeBuilder setOperator', () => {
    const dsl = { whereFilters: [{ field: 'category', operator: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')
    node?.setOperator('in')

    expect(builder.whereFilters.toJson()[0].operator).toBe('in')
  })

  test('WhereFilterNodeBuilder setValue', () => {
    const dsl = { whereFilters: [{ field: 'category', operator: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')
    node?.setValue(['Electronics', 'Books'])

    expect(builder.whereFilters.toJson()[0].value).toEqual(['Electronics', 'Books'])
  })

  test('WhereFilterNodeBuilder toJson', () => {
    const dsl = { whereFilters: [{ field: 'category', operator: 'eq', value: 'Electronics' }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.whereFilters.find('category')
    const json = node?.toJson()

    expect(json).toEqual({ field: 'category', operator: 'eq', value: 'Electronics' })
  })

  test('chained add operations', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters
      .add('category', (node) => node.setOperator('eq').setValue('Electronics'))
      .add('region', (node) => node.setOperator('eq').setValue('Beijing'))
      .add('sales', (node) => node.setOperator('gt').setValue(1000))

    const json = builder.whereFilters.toJson()

    expect(json.length).toBe(3)
    expect(json[0].field).toBe('category')
    expect(json[1].field).toBe('region')
    expect(json[2].field).toBe('sales')
  })

  test('various operators', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.whereFilters
      .add('field1', (node) => node.setOperator('eq').setValue('test'))
      .add('field2', (node) => node.setOperator('ne').setValue('test'))
      .add('field3', (node) => node.setOperator('gt').setValue(100))
      .add('field4', (node) => node.setOperator('gte').setValue(100))
      .add('field5', (node) => node.setOperator('lt').setValue(100))
      .add('field6', (node) => node.setOperator('lte').setValue(100))
      .add('field7', (node) => node.setOperator('in').setValue([1, 2, 3]))
      .add('field8', (node) => node.setOperator('like').setValue('%test%'))

    const json = builder.whereFilters.toJson()

    expect(json.length).toBe(8)
    expect(json[0].operator).toBe('eq')
    expect(json[1].operator).toBe('ne')
    expect(json[2].operator).toBe('gt')
    expect(json[3].operator).toBe('gte')
    expect(json[4].operator).toBe('lt')
    expect(json[5].operator).toBe('lte')
    expect(json[6].operator).toBe('in')
    expect(json[7].operator).toBe('like')
  })
})
