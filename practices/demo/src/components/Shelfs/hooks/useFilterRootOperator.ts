import type { VBIBuilder } from '@visactor/vbi';
import { useCallback } from 'react';
import { useBuilderDocState } from 'src/hooks/useBuilderDocState';
import type { RootOperator } from '../common/ShelfRootOperatorButton';

const FILTER_ROOT_KEY = {
  where: 'whereFilter',
  having: 'havingFilter',
} as const;

export const useFilterRootOperator = (params: {
  builder: VBIBuilder | undefined;
  type: keyof typeof FILTER_ROOT_KEY;
}) => {
  const { builder, type } = params;

  const operator = useBuilderDocState<RootOperator>({
    builder,
    fallback: 'and',
    getSnapshot: (activeBuilder) => {
      if (type === 'where') {
        return activeBuilder.whereFilter.toJSON().op === 'or' ? 'or' : 'and';
      }
      return activeBuilder.havingFilter.toJSON().op === 'or' ? 'or' : 'and';
    },
  });

  const setOperator = useCallback(
    (nextOperator: RootOperator) => {
      if (!builder || nextOperator === operator) {
        return;
      }

      builder.doc.transact(() => {
        const rootNode = builder.dsl.get(FILTER_ROOT_KEY[type]) as
          | { set: (key: string, value: unknown) => void }
          | undefined;
        rootNode?.set('op', nextOperator);
      });
    },
    [builder, operator, type],
  );

  return {
    operator,
    setOperator,
  };
};
