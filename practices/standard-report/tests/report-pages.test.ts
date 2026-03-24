import { expect, test } from '@rstest/core';
import { VBI } from '@visactor/vbi';
import {
  addReportPage,
  ensureReportHasPage,
  getFallbackActivePageId,
  getNextPageTitle,
} from '../src/utils/report-pages';

test('ensureReportHasPage creates a first page with demo connector', () => {
  const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL());
  const pageId = ensureReportHasPage(reportBuilder, 'demo');
  const page = reportBuilder.page.get(pageId)?.toJSON();

  expect(page?.title).toBe('Page 1');
  expect(page?.chart.connectorId).toBe('demo');
});

test('addReportPage appends sequential page titles', () => {
  const reportBuilder = VBI.createReport(VBI.generateEmptyReportDSL());
  ensureReportHasPage(reportBuilder, 'demo');
  addReportPage(reportBuilder, 'demo');

  expect(reportBuilder.build().pages.map((page) => page.title)).toEqual([
    'Page 1',
    'Page 2',
  ]);
});

test('getFallbackActivePageId chooses the adjacent page for the removed active page', () => {
  const pages = [
    { id: 'page-1', title: getNextPageTitle(0) },
    { id: 'page-2', title: getNextPageTitle(1) },
    { id: 'page-3', title: getNextPageTitle(2) },
  ] as any;

  expect(getFallbackActivePageId(pages, 'page-2', 'page-2')).toBe('page-3');
  expect(getFallbackActivePageId(pages, 'page-3', 'page-3')).toBe('page-2');
  expect(getFallbackActivePageId(pages, 'page-1', 'page-3')).toBe('page-3');
});
