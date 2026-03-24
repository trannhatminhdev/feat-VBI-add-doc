import { PlusCircleFilled } from '@ant-design/icons';
import type { VSeed } from '@visactor/vseed';
import { VSeedRender } from 'standard';
import { PageInsight } from './PageInsight';

type PagePreviewCanvasProps = {
  showPlaceholder: boolean;
  vseed: VSeed | null;
  onEdit: () => void;
};

export const PagePreviewCanvas = ({
  showPlaceholder,
  vseed,
  onEdit,
}: PagePreviewCanvasProps) => {
  if (showPlaceholder) {
    return (
      <button
        type="button"
        className="standard-report-page-shell standard-report-placeholder"
        onClick={onEdit}
      >
        <div className="standard-report-placeholder-body">
          <PlusCircleFilled className="standard-report-placeholder-icon" />
          <span className="standard-report-placeholder-title">
            点击添加图表
          </span>
          <span className="standard-report-placeholder-copy">
            图表铺满宽度，洞察文档紧跟在下方
          </span>
        </div>
        <PageInsight />
      </button>
    );
  }

  return (
    <div className="standard-report-page-shell">
      <div className="standard-report-renderer">
        {vseed ? <VSeedRender vseed={vseed} /> : null}
      </div>
      <PageInsight />
    </div>
  );
};
