import { FieldItem, GroupedFields } from './types';


 //给一些dimension进行分组

export const classifyDimensions = (dimensions: FieldItem[]): { groups: GroupedFields, standalone: FieldItem[] } => {
  const initialGroups: GroupedFields = { Area: [] };
  const initialStandalone: FieldItem[] = [];

  dimensions.forEach((d) => {
    const nameLower = d.name.toLowerCase();
    
    // 1. 区域关键词匹配
    if (nameLower.includes('city') || nameLower.includes('area') || nameLower.includes('province')) {
      initialGroups.Area.push(d);
      return;
    }

    // 2. 前缀正则匹配 (例如 user_name, user_id 分到 User 组)
    const match = d.name.match(/^([a-zA-Z0-9]+)[-_]/);
    if (match) {
      const prefix = match[1];
      const groupName = prefix.charAt(0).toUpperCase() + prefix.slice(1);

      if (initialGroups[groupName]) {
        initialGroups[groupName].push(d);
        return;
      }

      const existingIndex = initialStandalone.findIndex(s => {
        const sMatch = s.name.match(/^([a-zA-Z0-9]+)[-_]/);
        return sMatch && sMatch[1].toLowerCase() === prefix.toLowerCase();
      });

      if (existingIndex > -1) {
        const sibling = initialStandalone.splice(existingIndex, 1)[0];
        initialGroups[groupName] = [sibling, d];
        return;
      }
    }
    initialStandalone.push(d);
  });

  if (initialGroups.Area.length === 0) delete initialGroups.Area;
  return { groups: initialGroups, standalone: initialStandalone };
};


//一些分组
export const extractItem = (
  type: string,
  name: string,
  gName: string | undefined,
  nextGroups: GroupedFields,
  nextStandalone: FieldItem[]
): FieldItem | undefined => {
  let item: FieldItem | undefined;

  if (type === 'standalone') {
    const idx = nextStandalone.findIndex(f => f.name === name);
    if (idx > -1) item = nextStandalone.splice(idx, 1)[0];
  } else if (type === 'group' && gName && nextGroups[gName]) {
    const idx = nextGroups[gName].findIndex(f => f.name === name);
    if (idx > -1) {
      item = nextGroups[gName].splice(idx, 1)[0];
      if (nextGroups[gName].length === 0) delete nextGroups[gName];
    }
  }
  return item;
};