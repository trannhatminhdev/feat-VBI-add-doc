import { expect, test } from '@rstest/core';
import { render } from '@testing-library/react';
import { createDefaultReportBuilder } from '../src/utils/demoConnector';
import { addReportPage } from '../src/utils/report-pages';
import { useReportPageBuilder } from '../src/App/hooks/useReportPageBuilder';

const Probe = ({
  pageId,
  reportBuilder,
}: {
  pageId?: string;
  reportBuilder: ReturnType<typeof createDefaultReportBuilder>;
}) => {
  const pageResource = useReportPageBuilder(reportBuilder, pageId);
  return <div>{pageResource?.chart?.getUUID() ?? 'empty'}</div>;
};

test('useReportPageBuilder reuses page builders across rerenders', () => {
  const reportBuilder = createDefaultReportBuilder();
  const firstPageId = reportBuilder.build().pages[0]?.id ?? '';
  const secondPageId = addReportPage(reportBuilder, 'demo');
  const view = render(
    <Probe pageId={firstPageId} reportBuilder={reportBuilder} />,
  );
  const firstUUID = view.container.textContent;
  expect(firstUUID).toBeTruthy();

  view.rerender(<Probe pageId={firstPageId} reportBuilder={reportBuilder} />);
  expect(view.container.textContent).toBe(firstUUID);

  view.rerender(<Probe pageId={secondPageId} reportBuilder={reportBuilder} />);
  expect(view.container.textContent).not.toBe(firstUUID);
});
