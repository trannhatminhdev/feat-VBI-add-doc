import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { VBIReportBuilder, VBIReportPageDSL } from '@visactor/vbi';
import { Spin } from 'antd';
import { usePagePreview } from '../../hooks/usePagePreview';
import { StageNavButton } from '../stage/StageNavButton';
import { PageHoverActions } from './PageHoverActions';
import { PagePreviewCanvas } from './PagePreviewCanvas';

type PagePreviewCardProps = {
  canGoNext: boolean;
  canGoPrev: boolean;
  canRemove: boolean;
  page: VBIReportPageDSL;
  reportBuilder: VBIReportBuilder;
  revision: number;
  onAddPage: () => void;
  onEdit: (pageId: string) => void;
  onGoNext: () => void;
  onGoPrev: () => void;
  onRemovePage: (pageId: string) => void;
};

const isChartEmpty = (page: VBIReportPageDSL) => {
  return page.chart.dimensions.length === 0 && page.chart.measures.length === 0;
};

export const PagePreviewCard = ({
  canGoNext,
  canGoPrev,
  canRemove,
  page,
  reportBuilder,
  revision,
  onAddPage,
  onEdit,
  onGoNext,
  onGoPrev,
  onRemovePage,
}: PagePreviewCardProps) => {
  const { loading, vseed } = usePagePreview(reportBuilder, page.id, revision);
  const showPlaceholder = isChartEmpty(page) || (!loading && !vseed);

  return (
    <div className="standard-report-page">
      <div className="standard-report-page-nav is-left">
        <StageNavButton disabled={!canGoPrev} label="上一页" onClick={onGoPrev}>
          <LeftOutlined />
        </StageNavButton>
      </div>

      <div className="standard-report-page-nav is-right">
        <StageNavButton disabled={!canGoNext} label="下一页" onClick={onGoNext}>
          <RightOutlined />
        </StageNavButton>
      </div>

      <div className="standard-report-page-actions">
        <PageHoverActions
          canRemove={canRemove}
          showPlaceholder={showPlaceholder}
          onAddPage={onAddPage}
          onEdit={() => onEdit(page.id)}
          onRemovePage={() => onRemovePage(page.id)}
        />
      </div>

      <Spin spinning={loading} wrapperClassName="standard-report-page-spinner">
        <PagePreviewCanvas
          showPlaceholder={showPlaceholder}
          vseed={vseed}
          onEdit={() => onEdit(page.id)}
        />
      </Spin>
    </div>
  );
};
