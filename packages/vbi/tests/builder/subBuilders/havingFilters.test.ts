import { VBI } from '@visactor/vbi'
import { VBIDSL } from 'src/types/dsl'

describe('HavingFiltersBuilder', () => {
  test('addHavingFilter', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.havingFilters.add('sales', (node) => {
      node.setOperator('gt').setValue(1000)
    })

    const result = builder.build()
    expect(result.havingFilters).toEqual([
      {
        field: 'sales',
        operator: 'gt',
        value: 1000,
      },
    ])
  })

  test('addHavingFilter with default values', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)
    builder.havingFilters.add('sales', (node) => {
      node.setValue(500)
    })

    const result = builder.build()
    expect(result.havingFilters).toEqual([
      {
        field: 'sales',
        operator: 'eq',
        value: 500,
      },
    ])
  })

  test('addHavingFilter throws error for invalid field', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.havingFilters.add('', (node) => {
        node.setValue(100)
      })
    }).toThrow('Field is required and must be a string')
  })

  test('addHavingFilter throws error for null field', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.havingFilters.add(null as any, (node) => {
        node.setValue(100)
      })
    }).toThrow('Field is required and must be a string')
  })

  test('removeHavingFilter', () => {
    const dsl = {
      havingFilters: [
        { field: 'sales', operator: 'gt', value: 1000 },
        { field: 'profit', operator: 'gt', value: 500 },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.havingFilters.remove('sales')

    expect(builder.build().havingFilters).toEqual([{ field: 'profit', operator: 'gt', value: 500 }])
  })

  test('removeHavingFilter not found', () => {
    const dsl = { havingFilters: [{ field: 'sales', operator: 'gt', value: 1000 }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.havingFilters.remove('notExist')

    expect(builder.build().havingFilters).toEqual([{ field: 'sales', operator: 'gt', value: 1000 }])
  })

  test('updateHavingFilter', () => {
    const dsl = { havingFilters: [{ field: 'sales', operator: 'gt', value: 1000 }] } as VBIDSL
    const builder = VBI.from(dsl)

    builder.havingFilters.update('sales', (node) => {
      node.setOperator('gte').setValue(2000)
    })

    expect(builder.build().havingFilters).toEqual([{ field: 'sales', operator: 'gte', value: 2000 }])
  })

  test('updateHavingFilter throws error if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    expect(() => {
      builder.havingFilters.update('notExist', (node) => {
        node.setValue(100)
      })
    }).toThrow('Having filter with field "notExist" not found')
  })

  test('findHavingFilter', () => {
    const dsl = {
      havingFilters: [
        { field: 'sales', operator: 'gt', value: 1000 },
        { field: 'profit', operator: 'gt', value: 500 },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.havingFilters.find('sales')

    expect(node?.getField()).toBe('sales')
    expect(node?.toJson()).toEqual({ field: 'sales', operator: 'gt', value: 1000 })
  })

  test('findHavingFilter returns undefined if not found', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.havingFilters.find('notExist')

    expect(node).toBeUndefined()
  })

  test('findAllHavingFilters', () => {
    const dsl = {
      havingFilters: [
        { field: 'sales', operator: 'gt', value: 1000 },
        { field: 'profit', operator: 'gt', value: 500 },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const nodes = builder.havingFilters.findAll()

    expect(nodes.length).toBe(2)
    expect(nodes[0].getField()).toBe('sales')
    expect(nodes[1].getField()).toBe('profit')
  })

  test('findAllHavingFilters returns empty array when no filters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const nodes = builder.havingFilters.findAll()

    expect(nodes).toEqual([])
  })

  test('clearHavingFilters', () => {
    const dsl = {
      havingFilters: [
        { field: 'sales', operator: 'gt', value: 1000 },
        { field: 'profit', operator: 'gt', value: 500 },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    builder.havingFilters.clear()

    expect(builder.build().havingFilters).toEqual([])
  })

  test('toJson', () => {
    const dsl = {
      havingFilters: [
        { field: 'sales', operator: 'gt', value: 1000 },
        { field: 'profit', operator: 'gt', value: 500 },
      ],
    } as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.havingFilters.toJson()

    expect(json).toEqual([
      { field: 'sales', operator: 'gt', value: 1000 },
      { field: 'profit', operator: 'gt', value: 500 },
    ])
  })

  test('toJson returns empty array when no filters', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    const json = builder.havingFilters.toJson()

    expect(json).toEqual([])
  })

  test('observe and unobserve', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    let callCount = 0
    const callback = () => {
      callCount++
    }
    const unobserve = builder.havingFilters.observe(callback)

    builder.havingFilters.add('sales', (node) => {
      node.setValue(1000)
    })

    expect(callCount).toBe(1)

    unobserve()

    builder.havingFilters.add('profit', (node) => {
      node.setValue(500)
    })

    expect(callCount).toBe(1)
  })

  test('HavingFiltersNodeBuilder getField', () => {
    const dsl = { havingFilters: [{ field: 'sales', operator: 'gt', value: 1000 }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.havingFilters.find('sales')

    expect(node?.getField()).toBe('sales')
  })

  test('HavingFiltersNodeBuilder setValue', () => {
    const dsl = { havingFilters: [{ field: 'sales', operator: 'gt', value: 1000 }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.havingFilters.find('sales')
    node?.setValue(2000)

    expect(builder.havingFilters.toJson()[0].value).toBe(2000)
  })

  test('HavingFiltersNodeBuilder setOperator', () => {
    const dsl = { havingFilters: [{ field: 'sales', operator: 'gt', value: 1000 }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.havingFilters.find('sales')
    node?.setOperator('lt')

    expect(builder.havingFilters.toJson()[0].operator).toBe('lt')
  })

  test('HavingFiltersNodeBuilder toJson', () => {
    const dsl = { havingFilters: [{ field: 'sales', operator: 'gt', value: 1000 }] } as VBIDSL
    const builder = VBI.from(dsl)

    const node = builder.havingFilters.find('sales')
    const json = node?.toJson()

    expect(json).toEqual({ field: 'sales', operator: 'gt', value: 1000 })
  })

  test('chained add operations', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.havingFilters
      .add('sales', (node) => node.setOperator('gt').setValue(1000))
      .add('profit', (node) => node.setOperator('gte').setValue(500))
      .add('orders', (node) => node.setOperator('eq').setValue(100))

    const json = builder.havingFilters.toJson()

    expect(json.length).toBe(3)
    expect(json[0].field).toBe('sales')
    expect(json[1].field).toBe('profit')
    expect(json[2].field).toBe('orders')
  })

  test('various operators', () => {
    const dsl = {} as VBIDSL
    const builder = VBI.from(dsl)

    builder.havingFilters
      .add('field1', (node) => node.setOperator('eq').setValue(100))
      .add('field2', (node) => node.setOperator('ne').setValue(100))
      .add('field3', (node) => node.setOperator('gt').setValue(100))
      .add('field4', (node) => node.setOperator('gte').setValue(100))
      .add('field5', (node) => node.setOperator('lt').setValue(100))
      .add('field6', (node) => node.setOperator('lte').setValue(100))

    const json = builder.havingFilters.toJson()

    expect(json.length).toBe(6)
    expect(json[0].operator).toBe('eq')
    expect(json[1].operator).toBe('ne')
    expect(json[2].operator).toBe('gt')
    expect(json[3].operator).toBe('gte')
    expect(json[4].operator).toBe('lt')
    expect(json[5].operator).toBe('lte')
  })
})
