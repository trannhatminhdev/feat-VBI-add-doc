import type { VBIReportBuilder } from '@visactor/vbi';
import { expect, rs, test } from '@rstest/core';
import { render, screen } from '@testing-library/react';
import { useReportPageBuilder } from '../src/App/hooks/useReportPageBuilder';

type ReportBuilderStub = {
  page: {
    get: (pageId: string) => {
      chart: {
        id: string;
      };
    };
  };
};

const Probe = ({
  pageId,
  reportBuilder,
}: {
  pageId?: string;
  reportBuilder: ReportBuilderStub;
}) => {
  const pageBuilder = useReportPageBuilder(
    reportBuilder as unknown as VBIReportBuilder,
    pageId,
  );
  return <div>{pageBuilder?.chart.id ?? 'empty'}</div>;
};

test('useReportPageBuilder reuses page builders across rerenders', () => {
  const get = rs.fn((pageId: string) => ({ chart: { id: `chart-${pageId}` } }));
  const reportBuilder = {
    page: {
      get,
    },
  };
  const view = render(<Probe pageId="page-1" reportBuilder={reportBuilder} />);

  expect(screen.getByText('chart-page-1')).toBeInTheDocument();

  view.rerender(<Probe pageId="page-1" reportBuilder={reportBuilder} />);

  expect(get).toHaveBeenCalledTimes(1);

  view.rerender(<Probe pageId="page-2" reportBuilder={reportBuilder} />);

  expect(screen.getByText('chart-page-2')).toBeInTheDocument();
  expect(get).toHaveBeenCalledTimes(2);
});
