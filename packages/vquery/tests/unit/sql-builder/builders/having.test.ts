import { convertDSLToSQL } from '@visactor/vquery'

describe('having', () => {
  it('simple with sum', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: 'sum',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having (sum("total") = 1000)"`,
    )
  })

  it('simple with count', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'count'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'count',
              op: 'count',
              value: 10,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "count" from "orders" group by "region" having (count("count") = 10)"`,
    )
  })

  it('simple with avg', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'avg_amount'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'avg_amount',
              op: 'avg',
              value: 500,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "avg_amount" from "orders" group by "region" having (avg("avg_amount") = 500)"`,
    )
  })

  it('simple with >', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '>',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" > 1000)"`,
    )
  })

  it('simple with >=', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '>=',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" >= 1000)"`,
    )
  })

  it('simple with <', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '<',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" < 1000)"`,
    )
  })

  it('simple with <=', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '<=',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" <= 1000)"`,
    )
  })

  it('simple with =', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '=',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" = 1000)"`,
    )
  })

  it('simple with !=', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '!=',
              value: 1000,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" != 1000)"`,
    )
  })

  it('with or conditions', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'or',
          conditions: [
            {
              field: 'total',
              op: '>',
              value: 1000,
            },
            {
              field: 'total',
              op: '<',
              value: 100,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" > 1000 or "total" < 100)"`,
    )
  })

  it('with and conditions', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total', 'count'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: '>',
              value: 1000,
            },
            {
              field: 'count',
              op: '>',
              value: 5,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total", "count" from "orders" group by "region" having ("total" > 1000 and "count" > 5)"`,
    )
  })

  it('with nested conditions', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total', 'count'],
        groupBy: ['region'],
        having: {
          op: 'or',
          conditions: [
            {
              op: 'and',
              conditions: [
                {
                  field: 'total',
                  op: '>',
                  value: 1000,
                },
                {
                  field: 'count',
                  op: '>',
                  value: 5,
                },
              ],
            },
            {
              field: 'total',
              op: '<',
              value: 100,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total", "count" from "orders" group by "region" having (("total" > 1000 and "count" > 5) or "total" < 100)"`,
    )
  })

  it('empty', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(`"select "region", "total" from "orders" group by "region""`)
  })

  it('with between', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: 'between',
              value: [100, 1000],
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" between 100 and 1000)"`,
    )
  })

  it('with in', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'region',
              op: 'in',
              value: ['North', 'South'],
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("region" in ('North', 'South'))"`,
    )
  })

  it('with is null', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: 'is null',
              value: undefined,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" is null)"`,
    )
  })

  it('with is not null', () => {
    interface ORDER {
      id: number
      amount: number
      region: string
    }

    const sql = convertDSLToSQL<ORDER, 'orders'>(
      {
        select: ['region', 'total'],
        groupBy: ['region'],
        having: {
          op: 'and',
          conditions: [
            {
              field: 'total',
              op: 'is not null',
              value: undefined,
            },
          ],
        },
      },
      'orders',
    )
    expect(sql).toMatchInlineSnapshot(
      `"select "region", "total" from "orders" group by "region" having ("total" is not null)"`,
    )
  })
})
