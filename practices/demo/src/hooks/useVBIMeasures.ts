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

    // 初始化
    setMeasures(builder.measures.toJson() as VBIMeasure[]);

    // 监听变化
    const updateHandler = () => {
      setMeasures(builder.measures.toJson() as VBIMeasure[]);
    };

    const unobserve = builder.measures.observe(updateHandler);
    return unobserve;
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
