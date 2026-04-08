import { VBI, type VBIReportBuilder, type VBIReportDSL } from '@visactor/vbi';

export type ReportResourceFactory = Pick<
  typeof VBI,
  | 'createChart'
  | 'createInsight'
  | 'generateEmptyChartDSL'
  | 'generateEmptyInsightDSL'
>;

const findPageIndex = (pages: VBIReportDSL['pages'], pageId: string) => {
  return pages.findIndex((page) => page.id === pageId);
};

export const getNextPageTitle = (pageCount: number) => {
  return `Page ${pageCount + 1}`;
};

export const addReportPage = (
  reportBuilder: VBIReportBuilder,
  connectorId: string,
  options: { title?: string; vbi?: ReportResourceFactory } = {},
) => {
  const { vbi = VBI } = options;
  const title =
    options.title ?? getNextPageTitle(reportBuilder.build().pages.length);
  const chart = vbi.createChart(vbi.generateEmptyChartDSL(connectorId));
  const insight = vbi.createInsight(vbi.generateEmptyInsightDSL());

  reportBuilder.page.add(title, (page) => {
    page.setChartId(chart).setInsightId(insight);
  });

  const pages = reportBuilder.build().pages;
  return pages[pages.length - 1]?.id ?? '';
};

export const ensureReportHasPage = (
  reportBuilder: VBIReportBuilder,
  connectorId: string,
  vbi: ReportResourceFactory = VBI,
) => {
  const pages = reportBuilder.build().pages;
  return (
    pages[0]?.id ??
    addReportPage(reportBuilder, connectorId, { title: 'Page 1', vbi })
  );
};

export const getFallbackActivePageId = (
  pages: VBIReportDSL['pages'],
  removedPageId: string,
  activePageId: string,
) => {
  if (activePageId !== removedPageId) {
    return activePageId;
  }

  const removedIndex = findPageIndex(pages, removedPageId);
  if (removedIndex === -1) {
    return activePageId;
  }

  const nextPage = pages[removedIndex + 1] ?? pages[removedIndex - 1];
  return nextPage?.id ?? '';
};
