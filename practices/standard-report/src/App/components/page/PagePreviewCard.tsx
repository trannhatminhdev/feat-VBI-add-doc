import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { VBIReportBuilder, VBIReportPageDSL } from '@visactor/vbi';
import { memo, useCallback, useRef } from 'react';
import { useReportPageBuilder } from '../../hooks/useReportPageBuilder';
import { StageNavButton } from '../stage/StageNavButton';
import { PageHoverActions } from './PageHoverActions';
import { PagePreviewCanvas } from './PagePreviewCanvas';

type PagePreviewCardProps = {
  canRemove: boolean;
  index: number;
  page: VBIReportPageDSL;
  pageCount: number;
  reportBuilder: VBIReportBuilder;
  onAddPage: () => void;
  onEdit: (pageId: string, sourceElement?: HTMLElement | null) => void;
  onNavigate: (nextIndex: number) => void;
  onRemovePage: (pageId: string) => void;
};

export const PagePreviewCard = memo(
  ({
    canRemove,
    index,
    page,
    pageCount,
    reportBuilder,
    onAddPage,
    onEdit,
    onNavigate,
    onRemovePage,
  }: PagePreviewCardProps) => {
    const previewRef = useRef<HTMLDivElement | null>(null);
    const pageBuilder = useReportPageBuilder(reportBuilder, page.id);
    const showPlaceholder = !pageBuilder?.chart || pageBuilder.chart.isEmpty();
    const canGoPrev = index > 0;
    const canGoNext = index < pageCount - 1;
    const openPageEditor = useCallback(() => {
      onEdit(page.id, previewRef.current);
    }, [onEdit, page.id]);
    const goPrev = useCallback(() => {
      onNavigate(index - 1);
    }, [index, onNavigate]);
    const goNext = useCallback(() => {
      onNavigate(index + 1);
    }, [index, onNavigate]);
    const removePage = useCallback(() => {
      onRemovePage(page.id);
    }, [onRemovePage, page.id]);

    return (
      <div className="standard-report-page">
        <div className="standard-report-page-nav is-left">
          <StageNavButton disabled={!canGoPrev} label="上一页" onClick={goPrev}>
            <LeftOutlined />
          </StageNavButton>
        </div>

        <div className="standard-report-page-nav is-right">
          <StageNavButton disabled={!canGoNext} label="下一页" onClick={goNext}>
            <RightOutlined />
          </StageNavButton>
        </div>

        <div className="standard-report-page-actions">
          <PageHoverActions
            canRemove={canRemove}
            showPlaceholder={showPlaceholder}
            onAddPage={onAddPage}
            onEdit={openPageEditor}
            onRemovePage={removePage}
          />
        </div>

        <PagePreviewCanvas
          previewRef={previewRef}
          builder={pageBuilder?.chart}
          pageId={page.id}
          showPlaceholder={showPlaceholder}
          onEdit={openPageEditor}
        />
      </div>
    );
  },
);
