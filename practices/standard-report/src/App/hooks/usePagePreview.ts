import type { VBIReportBuilder } from '@visactor/vbi';
import type { VSeed } from '@visactor/vseed';
import { useEffect, useState } from 'react';

type PreviewState = {
  loading: boolean;
  vseed: VSeed | null;
};

const getInitialState = (
  reportBuilder: VBIReportBuilder,
  pageId: string,
): PreviewState => {
  const pageBuilder = reportBuilder.page.get(pageId);
  return pageBuilder?.chart && !pageBuilder.chart.isEmpty()
    ? { loading: true, vseed: null }
    : { loading: false, vseed: null };
};

export const usePagePreview = (
  reportBuilder: VBIReportBuilder,
  pageId: string,
  revision: number,
) => {
  const [state, setState] = useState<PreviewState>(() =>
    getInitialState(reportBuilder, pageId),
  );

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      const pageBuilder = reportBuilder.page.get(pageId);
      if (!pageBuilder?.chart || pageBuilder.chart.isEmpty()) {
        if (!cancelled) setState({ loading: false, vseed: null });
        return;
      }

      setState({ loading: true, vseed: null });
      try {
        const vseed = await pageBuilder.chart.buildVSeed();
        if (!cancelled) setState({ loading: false, vseed });
      } catch (error) {
        console.error('Failed to build report page preview:', error);
        if (!cancelled) setState({ loading: false, vseed: null });
      }
    };

    void loadPreview();
    return () => {
      cancelled = true;
    };
  }, [pageId, reportBuilder, revision]);

  return state;
};
