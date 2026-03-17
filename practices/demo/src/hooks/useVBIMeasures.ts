import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder } from '@visactor/vbi';

export interface VBIMeasure {
  field: string;
  alias: string;
  encoding?: string;
  aggregate?: {
    func: string;
  };
}

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
    (field: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.measures.add(field, () => {});
        });
      }
    },
    [builder],
  );

  // 删除度量
  const removeMeasure = useCallback(
    (field: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.measures.remove(field);
        });
      }
    },
    [builder],
  );

  // 更新度量
  const updateMeasure = useCallback(
    (field: string, callback: (node: any) => void) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.measures.update(field, callback);
        });
      }
    },
    [builder],
  );

  // 查找度量
  const findMeasure = useCallback(
    (field: string) => {
      if (builder) {
        return builder.measures.find(field);
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
