import { VBI, type VBIReportBuilder, type VBIReportDSL } from '@visactor/vbi';

const findPageIndex = (pages: VBIReportDSL['pages'], pageId: string) => {
  return pages.findIndex((page) => page.id === pageId);
};

export const getNextPageTitle = (pageCount: number) => {
  return `Page ${pageCount + 1}`;
};

export const addReportPage = (
  reportBuilder: VBIReportBuilder,
  connectorId: string,
  title = getNextPageTitle(reportBuilder.build().pages.length),
) => {
  reportBuilder.page.add(title, (page) => {
    page.setChart(VBI.generateEmptyChartDSL(connectorId));
  });

  const pages = reportBuilder.build().pages;
  return pages[pages.length - 1]?.id ?? '';
};

export const ensureReportHasPage = (
  reportBuilder: VBIReportBuilder,
  connectorId: string,
) => {
  const pages = reportBuilder.build().pages;
  return pages[0]?.id ?? addReportPage(reportBuilder, connectorId, 'Page 1');
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
