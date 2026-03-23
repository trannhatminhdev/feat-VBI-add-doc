import type {
  VBIWhereFilter,
  VBIWhereClause,
  VBIWhereGroup,
  VBIHavingClause,
  VBIHavingFilter,
  VBIHavingGroup,
} from 'src/types/dsl'

export function isVBIFilter(clause: VBIWhereClause): clause is VBIWhereFilter {
  return 'field' in clause
}

export function isVBIWhereGroup(clause: VBIWhereClause): clause is VBIWhereGroup {
  return 'conditions' in clause
}

export function isVBIHavingFilter(clause: VBIHavingClause): clause is VBIHavingFilter {
  return 'field' in clause
}

export function isVBIHavingGroup(clause: VBIHavingClause): clause is VBIHavingGroup {
  return 'conditions' in clause
}
