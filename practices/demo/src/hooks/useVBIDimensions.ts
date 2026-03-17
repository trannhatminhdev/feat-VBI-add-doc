import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder } from '@visactor/vbi';

export interface VBIDimension {
  field: string;
  alias: string;
}

/**
 * VBI Dimensions Hook
 * 提供维度管理
 */
export const useVBIDimensions = (builder: VBIBuilder | undefined) => {
  const [dimensions, setDimensions] = useState<VBIDimension[]>([]);

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 统一由 toJSON 驱动 UI 状态
    const syncFromBuilder = () => {
      setDimensions(builder.dimensions.toJSON() as VBIDimension[]);
    };

    syncFromBuilder();
    builder.doc.on('update', syncFromBuilder);

    return () => {
      builder.doc.off('update', syncFromBuilder);
    };
  }, [builder]);

  // 添加维度
  const addDimension = useCallback(
    (field: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.dimensions.add(field, () => {});
        });
      }
    },
    [builder],
  );

  // 删除维度
  const removeDimension = useCallback(
    (field: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.dimensions.remove(field);
        });
      }
    },
    [builder],
  );

  // 更新维度
  const updateDimension = useCallback(
    (field: string, callback: (node: any) => void) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.dimensions.update(field, callback);
        });
      }
    },
    [builder],
  );

  // 查找维度
  const findDimension = useCallback(
    (field: string) => {
      if (builder) {
        return builder.dimensions.find((node) => node.getField() === field);
      }
      return undefined;
    },
    [builder],
  );

  return {
    dimensions,
    addDimension,
    removeDimension,
    updateDimension,
    findDimension,
  };
};
