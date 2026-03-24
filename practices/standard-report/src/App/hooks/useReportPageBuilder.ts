import type { VBIReportBuilder } from '@visactor/vbi';
import { useMemo } from 'react';

type ReportPageBuilderLike = ReturnType<VBIReportBuilder['page']['get']>;

const pageBuilderCache = new WeakMap<
  VBIReportBuilder,
  Map<string, ReportPageBuilderLike>
>();

const getBuilderCache = (reportBuilder: VBIReportBuilder) => {
  const cached = pageBuilderCache.get(reportBuilder);
  if (cached) {
    return cached;
  }

  const nextCache = new Map<string, ReportPageBuilderLike>();
  pageBuilderCache.set(reportBuilder, nextCache);
  return nextCache;
};

const readPageBuilder = (reportBuilder: VBIReportBuilder, pageId: string) => {
  const cache = getBuilderCache(reportBuilder);
  if (!cache.has(pageId)) {
    cache.set(pageId, reportBuilder.page.get(pageId));
  }
  return cache.get(pageId);
};

export const useReportPageBuilder = (
  reportBuilder: VBIReportBuilder,
  pageId?: string,
) => {
  return useMemo(() => {
    return pageId ? readPageBuilder(reportBuilder, pageId) : undefined;
  }, [pageId, reportBuilder]);
};
