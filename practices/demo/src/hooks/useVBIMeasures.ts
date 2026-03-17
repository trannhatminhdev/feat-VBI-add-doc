import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder, type VBIMeasure as CoreVBIMeasure } from '@visactor/vbi';

export type VBIMeasure = Omit<CoreVBIMeasure, 'encoding' | 'aggregate'> & {
  encoding?: CoreVBIMeasure['encoding'];
  aggregate?: CoreVBIMeasure['aggregate'];
};

/**
 * VBI Measures Hook
 * 提供度量管理
 */
export const useVBIMeasures = (builder: VBIBuilder | undefined) => {
  const [measures, setMeasures] = useState<VBIMeasure[]>([]);

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 统一由 toJSON 驱动 UI 状态
    const syncFromBuilder = () => {
      setMeasures(builder.measures.toJSON() as VBIMeasure[]);
    };

    syncFromBuilder();
    builder.doc.on('update', syncFromBuilder);

    return () => {
      builder.doc.off('update', syncFromBuilder);
    };
  }, [builder]);

  // 添加度量
  const addMeasure = useCallback(
    (field: string, callback?: (node: any) => void) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.measures.add(field, (node) => {
            callback?.(node);
          });
        });
      }
    },
    [builder],
  );

  // 删除度量
  const removeMeasure = useCallback(
    (id: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.measures.remove(id);
        });
      }
    },
    [builder],
  );

  // 更新度量
  const updateMeasure = useCallback(
    (id: string, callback: (node: any) => void) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.measures.update(id, callback);
        });
      }
    },
    [builder],
  );

  // 查找度量
  const findMeasure = useCallback(
    (id: string) => {
      if (builder) {
        return builder.measures.find((node) => node.getId() === id);
      }
      return undefined;
    },
    [builder],
  );

  return {
    measures,
    addMeasure,
    removeMeasure,
    updateMeasure,
    findMeasure,
  };
};
