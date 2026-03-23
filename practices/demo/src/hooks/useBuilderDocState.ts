import { useEffect, useRef, useState } from 'react';
import type { VBIChartBuilder } from '@visactor/vbi';

export const useBuilderDocState = <T>(params: {
  builder: VBIChartBuilder | undefined;
  fallback: T;
  getSnapshot: (builder: VBIChartBuilder) => T;
}) => {
  const { builder, fallback, getSnapshot } = params;
  const [state, setState] = useState<T>(fallback);
  const getSnapshotRef = useRef(getSnapshot);

  useEffect(() => {
    getSnapshotRef.current = getSnapshot;
  }, [getSnapshot]);

  useEffect(() => {
    if (!builder) {
      setState(fallback);
      return;
    }

    const syncFromBuilder = () => {
      setState(getSnapshotRef.current(builder));
    };

    syncFromBuilder();
    builder.doc.on('update', syncFromBuilder);

    return () => {
      builder.doc.off('update', syncFromBuilder);
    };
  }, [builder, fallback]);

  return state;
};
