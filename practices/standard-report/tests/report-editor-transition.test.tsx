import { expect, test } from '@rstest/core';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { ReportEditorDrawer } from '../src/App/components/editor/ReportEditorDrawer';
import { useReportStore } from '../src/model';
import { createDefaultReportBuilder } from '../src/utils/demoConnector';

const resetReportStore = () => {
  const reportBuilder = createDefaultReportBuilder();
  const report = reportBuilder.build();

  useReportStore.setState({
    reportBuilder,
    report,
    initialized: true,
    revision: 0,
    activePageId: report.pages[0]?.id ?? '',
    editorOpen: false,
    editorSourceRect: null,
  });

  return report.pages[0]?.id ?? '';
};

test('report editor opens as a fullscreen transition layer instead of a drawer', async () => {
  const pageId = resetReportStore();

  render(<ReportEditorDrawer />);

  act(() => {
    useReportStore.getState().openEditor(pageId, {
      top: 24,
      left: 32,
      width: 480,
      height: 320,
      borderRadius: 28,
    });
  });

  const editorRoot = await screen.findByTestId('standard-report-editor-root');
  expect(editorRoot).toBeInTheDocument();
  expect(document.body.querySelector('.ant-drawer')).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: /Go Back/ }));

  await waitFor(() => {
    expect(
      screen.queryByTestId('standard-report-editor-root'),
    ).not.toBeInTheDocument();
  });
});
