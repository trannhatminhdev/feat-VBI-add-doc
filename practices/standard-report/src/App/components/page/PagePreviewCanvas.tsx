import type { RefObject } from 'react';
import type { VBIChartBuilder } from '@visactor/vbi';
import { APP as StandardAPP } from 'standard';
import { PageInsight } from './PageInsight';

type PagePreviewCanvasProps = {
  builder?: VBIChartBuilder;
  pageId: string;
  previewRef: RefObject<HTMLDivElement | null>;
  showPlaceholder: boolean;
  onEdit: () => void;
};

export const PagePreviewCanvas = ({
  builder,
  pageId,
  previewRef,
  showPlaceholder,
  onEdit,
}: PagePreviewCanvasProps) => {
  const preview = builder ? (
    <StandardAPP builder={builder} mode="view" />
  ) : null;

  if (showPlaceholder) {
    return (
      <div
        ref={previewRef}
        data-report-preview-page-id={pageId}
        className="standard-report-page-shell"
      >
        <button
          type="button"
          className="standard-report-preview-entry is-empty"
          onClick={onEdit}
        >
          <div className="standard-report-renderer">{preview}</div>
        </button>
        <PageInsight />
      </div>
    );
  }

  return (
    <div
      ref={previewRef}
      data-report-preview-page-id={pageId}
      className="standard-report-page-shell"
    >
      <div className="standard-report-preview-entry">
        <div className="standard-report-renderer">{preview}</div>
      </div>
      <PageInsight />
    </div>
  );
};
