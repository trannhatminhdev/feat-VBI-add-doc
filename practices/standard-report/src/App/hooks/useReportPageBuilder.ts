import type { VBIReportBuilder } from '@visactor/vbi';

export const useReportPageBuilder = (
  reportBuilder: VBIReportBuilder,
  pageId?: string,
) => {
  return pageId ? reportBuilder.page.get(pageId) : undefined;
};
