import { expect, test } from '@rstest/core';
import { createVBI, VBI } from '@visactor/vbi';
import {
  addReportPage,
  ensureReportHasPage,
  getFallbackActivePageId,
  getNextPageTitle,
} from '../src/utils/report-pages';

test('ensureReportHasPage creates a first page with the provided VBI instance', () => {
  const LocalVBI = createVBI();
  const reportBuilder = LocalVBI.createReport(
    LocalVBI.generateEmptyReportDSL(),
  );
  const pageId = ensureReportHasPage(reportBuilder, 'demo', LocalVBI);
  const page = reportBuilder.build().pages.find((item) => item.id === pageId);
  const pageBuilder = reportBuilder.page.get(pageId);

  expect(page?.title).toBe('Page 1');
  expect(pageBuilder?.chart?.build().connectorId).toBe('demo');
  expect(page?.insightId).toBeTruthy();
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
