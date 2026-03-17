import { convertDSLToSQL } from '@visactor/vquery'

describe('having', () => {
  it('empty', () => {
    interface USER {
      id: number
      age: number
      department: string
    }

    const sql = convertDSLToSQL<USER, 'orders'>(
      {
        select: ['department', { field: 'age', aggr: { func: 'sum' }, alias: 'TOTAL_AGE' }],
        groupBy: ['department'],
      },
      'orders',
    )

    expect(sql).toMatchInlineSnapshot(
      `"select "department", sum("age") as "TOTAL_AGE" from "orders" group by "department""`,
    )
  })

  it('aggregate operators', () => {
    interface USER {
      id: number
      age: number
      department: string
    }

    const sql = convertDSLToSQL<USER, 'orders'>(
      {
        select: [
          'department',
          { field: 'age', aggr: { func: 'sum' }, alias: 'SUM_AGE' },
          { field: 'age', aggr: { func: 'avg' }, alias: 'AVG_AGE' },
          { field: 'id', aggr: { func: 'count' }, alias: 'CNT' },
          { field: 'age', aggr: { func: 'min' }, alias: 'MIN_AGE' },
          { field: 'age', aggr: { func: 'max' }, alias: 'MAX_AGE' },
        ],
        groupBy: ['department'],
        having: {
          op: 'and',
          conditions: [
            { field: 'age', op: 'sum', value: 100 },
            { field: 'age', op: 'avg', value: 20 },
            { field: 'id', op: 'count', value: 2 },
            { field: 'age', op: 'min', value: 10 },
            { field: 'age', op: 'max', value: 80 },
          ],
        },
      },
      'orders',
    )

    expect(sql).toMatchInlineSnapshot(
      `"select "department", sum("age") as "SUM_AGE", avg("age") as "AVG_AGE", CAST(count("id") AS INTEGER) as "CNT", min("age") as "MIN_AGE", max("age") as "MAX_AGE" from "orders" group by "department" having (sum("age") = 100 and avg("age") = 20 and count("id") = 2 and min("age") = 10 and max("age") = 80)"`,
    )
  })

  it('nested and/or with comparison', () => {
    interface USER {
      id: number
      age: number
      department: string
    }

    const sql = convertDSLToSQL<USER, 'orders'>(
      {
        select: ['department', { field: 'age', aggr: { func: 'avg' }, alias: 'AVG_AGE' }],
        groupBy: ['department'],
        having: {
          op: 'or',
          conditions: [
            {
              op: 'and',
              conditions: [
                { field: 'age', op: '>=', value: 18 },
                { field: 'age', op: '<=', value: 30 },
              ],
            },
            { field: 'department', op: '=', value: 'engineering' },
          ],
        },
      },
      'orders',
    )

    expect(sql).toMatchInlineSnapshot(
      `"select "department", avg("age") as "AVG_AGE" from "orders" group by "department" having (("age" >= 18 and "age" <= 30) or "department" = 'engineering')"`,
    )
  })

  it('is null & is not null', () => {
    interface USER {
      id: number
      age: number
      department: string | null
    }

    const sql = convertDSLToSQL<USER, 'orders'>(
      {
        select: ['department', { field: 'age', aggr: { func: 'sum' }, alias: 'TOTAL_AGE' }],
        groupBy: ['department'],
        having: {
          op: 'or',
          conditions: [
            { field: 'department', op: 'is null' },
            { field: 'department', op: 'is not null' },
          ],
        },
      },
      'orders',
    )

    expect(sql).toMatchInlineSnapshot(
      `"select "department", sum("age") as "TOTAL_AGE" from "orders" group by "department" having ("department" is null or "department" is not null)"`,
    )
  })

  it('between & not between', () => {
    interface USER {
      id: number
      age: number
      department: string
    }

    const sql = convertDSLToSQL<USER, 'orders'>(
      {
        select: ['department', { field: 'age', aggr: { func: 'avg' }, alias: 'AVG_AGE' }],
        groupBy: ['department'],
        having: {
          op: 'or',
          conditions: [
            { field: 'age', op: 'between', value: [18, 30] },
            { field: 'age', op: 'not between', value: [40, 50] },
          ],
        },
      },
      'orders',
    )

    expect(sql).toMatchInlineSnapshot(
      `"select "department", avg("age") as "AVG_AGE" from "orders" group by "department" having ("age" between 18 and 30 or "age" not between 40 and 50)"`,
    )
  })

  it('in & not in with single value', () => {
    interface USER {
      id: number
      age: number
      department: string
    }

    const sql = convertDSLToSQL<USER, 'orders'>(
      {
        select: ['department', { field: 'age', aggr: { func: 'sum' }, alias: 'TOTAL_AGE' }],
        groupBy: ['department'],
        having: {
          op: 'and',
          conditions: [
            { field: 'department', op: 'in', value: 'sales' },
            { field: 'department', op: 'not in', value: 'finance' },
          ],
        },
      },
      'orders',
    )

    expect(sql).toMatchInlineSnapshot(
      `"select "department", sum("age") as "TOTAL_AGE" from "orders" group by "department" having ("department" in ('sales') and not "department" in ('finance'))"`,
    )
  })
})
