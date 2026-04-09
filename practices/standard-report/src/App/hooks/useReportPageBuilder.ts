import type { VBIChartBuilder, VBIReportBuilder } from '@visactor/vbi';

type ReportPageBuilderLike = {
  chart?: VBIChartBuilder;
};

export const useReportPageBuilder = (
  reportBuilder: VBIReportBuilder,
  pageId?: string,
): ReportPageBuilderLike | undefined => {
  return pageId
    ? (reportBuilder.page.get(pageId) as ReportPageBuilderLike | undefined)
    : undefined;
};
