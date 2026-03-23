import { useCallback } from 'react';
import {
  VBIBuilder,
  type VBIDimension as CoreVBIDimension,
  type VBISort,
} from '@visactor/vbi';
import { useBuilderDocState } from './useBuilderDocState';

export type VBIDimension = CoreVBIDimension;

type DimensionNodeLike = {
  getEncoding?: () => VBIDimension['encoding'];
  setEncoding: (encoding: NonNullable<VBIDimension['encoding']>) => unknown;
  getSort?: () => VBISort | undefined;
  setSort: (sort: VBISort) => unknown;
  clearSort: () => unknown;
  setAlias: (alias: string) => unknown;
  setAggregate: (aggregate: NonNullable<VBIDimension['aggregate']>) => unknown;
  clearAggregate?: () => unknown;
};
type DimensionNodeMutator = (node: DimensionNodeLike) => void;
const EMPTY_DIMENSIONS: VBIDimension[] = [];

/**
 * VBI Dimensions Hook
 * 提供维度管理
 */
export const useVBIDimensions = (builder: VBIBuilder | undefined) => {
  const dimensions = useBuilderDocState({
    builder,
    fallback: EMPTY_DIMENSIONS,
    getSnapshot: (activeBuilder) =>
      activeBuilder.dimensions.toJSON() as VBIDimension[],
  });

  // 添加维度
  const addDimension = useCallback(
    (field: string, callback?: DimensionNodeMutator) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.dimensions.add(field, (node) => {
            callback?.(node);
          });
        });
      }
    },
    [builder],
  );

  // 删除维度
  const removeDimension = useCallback(
    (id: string) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.dimensions.remove(id);
        });
      }
    },
    [builder],
  );

  // 更新维度
  const updateDimension = useCallback(
    (id: string, callback: DimensionNodeMutator) => {
      if (builder) {
        builder.doc.transact(() => {
          builder.dimensions.update(id, callback);
        });
      }
    },
    [builder],
  );

  // 查找维度
  const findDimension = useCallback(
    (id: string) => {
      if (builder) {
        return builder.dimensions.find((node) => node.getId() === id);
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
