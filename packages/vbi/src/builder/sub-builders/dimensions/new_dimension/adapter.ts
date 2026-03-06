
import { 
  BaseCondition, 
  LogicalCondition, 
  ConditionTuple, 
  LogicGroup, 
  VBIInputSpec, 
  VQueryDSLConfig 
} from './types';


export function parseWhereLogic(node: LogicGroup | ConditionTuple): BaseCondition | LogicalCondition | undefined {
  // 处理 ['age', '>=', 18]
  if (Array.isArray(node)) {
    const [field, op, value] = node;
    const baseCondition: BaseCondition = { field, op };
    
    // is null / is not null
    if (value !== undefined) {
      baseCondition.value = value;
    }
    return baseCondition;
  }

  // 处理 AND / OR
  if (node.AND) {
    return {
      op: 'and',
      conditions: node.AND.map(parseWhereLogic).filter(Boolean) as (BaseCondition | LogicalCondition)[]
    };
  }

  if (node.OR) {
    return {
      op: 'or',
      conditions: node.OR.map(parseWhereLogic).filter(Boolean) as (BaseCondition | LogicalCondition)[]
    };
  }

  return undefined;
}

 //生成config
export function buildVBISpec(input: VBIInputSpec) {
  // 1. vquery DSL
  const vqueryDSL: VQueryDSLConfig = {};
  
  if (input.select && input.select.length > 0) {
    vqueryDSL.select = input.select;
  }

  if (input.where) {
    const parsedWhere = parseWhereLogic(input.where);
    if (parsedWhere) {
      vqueryDSL.where = parsedWhere;
    }
  }

  // 2.完整的config
  return {
    datasetId: input.datasetId,
    schema: input.schema,
    dataset: input.dataset,
    vquery: vqueryDSL
  };
}