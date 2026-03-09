export type DiscreteValue = string | number | boolean
export type ContinuousValue = number
export type FieldName = string

export interface BaseCondition {
  field: FieldName
  op: string
  value?: any
}

export interface LogicalCondition {
  op: 'and' | 'or'
  conditions: (BaseCondition | LogicalCondition)[]
}

export type WhereCondition = BaseCondition | LogicalCondition

export interface VQueryDSLConfig {
  select?: FieldName[]
  where?: WhereCondition
}

// ---UI接口类型
export type VQueryOperator =
  | '='
  | '!='
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'not in'
  | 'between'
  | 'not between'
  | 'is null'
  | 'is not null'

// 元组: [维度, 运算符, 数值] (如 ['age', '>=', 18])
export type ConditionTuple = [FieldName, VQueryOperator, any?]

// 逻辑符号
export interface LogicGroup {
  AND?: (ConditionTuple | LogicGroup)[]
  OR?: (ConditionTuple | LogicGroup)[]
}

// --- UI需要输入的东西
export interface VBIInputSpec {
  datasetId: string
  schema: any[]
  dataset: any[]
  select?: FieldName[]
  where?: LogicGroup | ConditionTuple
}
