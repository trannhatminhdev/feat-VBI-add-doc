import { useCallback } from 'react';
import {
  VBIChartBuilder,
  type VBIMeasure as CoreVBIMeasure,
  type VBIMeasureFormat,
  type VBISort,
} from '@visactor/vbi';
import { useBuilderDocState } from './useBuilderDocState';

export type VBIMeasure = Omit<CoreVBIMeasure, 'encoding' | 'aggregate'> & {
  encoding?: CoreVBIMeasure['encoding'];
  aggregate?: CoreVBIMeasure['aggregate'];
};

type MeasureNodeLike = {
  getEncoding?: () => VBIMeasure['encoding'];
  setEncoding: (encoding: NonNullable<VBIMeasure['encoding']>) => unknown;
  getSort?: () => VBISort | undefined;
  setSort: (sort: VBISort) => unknown;
  clearSort: () => unknown;
  setAlias: (alias: string) => unknown;
  setAggregate: (aggregate: NonNullable<VBIMeasure['aggregate']>) => unknown;
  setFormat: (format: VBIMeasureFormat) => unknown;
  getFormat?: () => VBIMeasureFormat | undefined;
  clearFormat: () => unknown;
};

type MeasureNodeMutator = (node: MeasureNodeLike) => void;
const EMPTY_MEASURES: VBIMeasure[] = [];
type UseVBIMeasuresResult = {
  measures: VBIMeasure[];
  addMeasure: (field: string, callback?: MeasureNodeMutator) => void;
  removeMeasure: (id: string) => void;
  updateMeasure: (id: string, callback: MeasureNodeMutator) => void;
  findMeasure: (id: string) => MeasureNodeLike | undefined;
};

/**
 * VBI Measures Hook
 * 提供度量管理
 */
export const useVBIMeasures = (
  builder: VBIChartBuilder | undefined,
): UseVBIMeasuresResult => {
  const measures = useBuilderDocState({
    builder,
    fallback: EMPTY_MEASURES,
    getSnapshot: (activeBuilder) =>
      activeBuilder.measures.toJSON() as VBIMeasure[],
  });

  // 添加度量
  const addMeasure = useCallback(
    (field: string, callback?: MeasureNodeMutator) => {
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
    (id: string, callback: MeasureNodeMutator) => {
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
