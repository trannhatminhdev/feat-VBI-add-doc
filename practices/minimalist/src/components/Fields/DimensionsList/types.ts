export type FieldItem = { name: string; type: string;alias?: string;};
export type GroupedFields = Record<string, FieldItem[]>;

export interface DragData {
  name: string;
  type: 'dimension';
  source: 'group' | 'standalone';
  groupName?: string;
  alias?: string;
}

