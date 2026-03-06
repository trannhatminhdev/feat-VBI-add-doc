import { useState, useCallback } from 'react';
import { FieldItem, GroupedFields, DragData } from './types';
import { extractItem } from './dimensionLogic';

export const useDimensionActions = () => {
  const [groups, setGroups] = useState<GroupedFields>({});
  const [standalone, setStandalone] = useState<FieldItem[]>([]);

 
  const addDimension = useCallback((name: string) => {
    setStandalone(prev => [...prev, { name, type: 'string' }]);
  }, []);


  const handleDropOnBar = useCallback((e: React.DragEvent, currentGroups: GroupedFields, currentStandalone: FieldItem[]) => {
    e.preventDefault();
    try {
      const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type !== 'dimension' || data.source === 'standalone') return;

      const nextGroups = { ...currentGroups };
      const nextStandalone = [...currentStandalone];
      const item = extractItem(data.source, data.name, data.groupName, nextGroups, nextStandalone);

      if (item) {
        if (!nextStandalone.find(f => f.name === item.name)) {
          nextStandalone.push(item);
        }
        setGroups(nextGroups);
        setStandalone(nextStandalone);
      }
    } catch (err) { console.error(err); }
  }, []);


  const moveToGroup = useCallback((data: DragData, targetCategory: string, currentGroups: GroupedFields, currentStandalone: FieldItem[]) => {
    const nextGroups = { ...currentGroups };
    const nextStandalone = [...currentStandalone];
    const item = extractItem(data.source, data.name, data.groupName, nextGroups, nextStandalone);

    if (item) {
      if (!nextGroups[targetCategory]) nextGroups[targetCategory] = [];
      if (!nextGroups[targetCategory].find(f => f.name === item.name)) {
        nextGroups[targetCategory].push(item);
      }
      setGroups(nextGroups);
      setStandalone(nextStandalone);
    }
  }, []);


  const updateDimensionAlias = useCallback((name: string, newAlias: string, item: any) => {
    // 1. 持久化到底层 Y.js
    if (item) {
      item.alias = newAlias;
    }

    // 2. 更新本地散点区 (Standalone) 状态
    setStandalone(prev => prev.map(item =>
      item.name === name ? { ...item, alias: newAlias } : item
    ));

    // 3. 更新本地分组区 (Groups) 状态
    setGroups(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(key => {
        next[key] = next[key].map(item =>
          item.name === name ? { ...item, alias: newAlias } : item
        );
      });
      return next;
    });
  }, []);

  return { 
    groups, setGroups, 
    standalone, setStandalone, 
    addDimension, 
    handleDropOnBar,
    moveToGroup ,
    updateDimensionAlias
  };
};