import { ArrowLeftOutlined } from '@ant-design/icons';
import { APP as StandardAPP } from 'standard';
import { Button, Drawer } from 'antd';
import { useReportStore } from 'src/model';

export const ReportEditorDrawer = () => {
  const open = useReportStore((state) => state.editorOpen);
  const pageId = useReportStore((state) => state.activePageId);
  const report = useReportStore((state) => state.report);
  const reportBuilder = useReportStore((state) => state.reportBuilder);
  const closeEditor = useReportStore((state) => state.closeEditor);
  const pageBuilder = pageId ? reportBuilder.page.get(pageId) : undefined;
  const page = report.pages.find((item) => item.id === pageId);

  return (
    <Drawer
      open={open}
      destroyOnHidden
      width="100vw"
      title={null}
      closable={false}
      onClose={closeEditor}
      styles={{ body: { padding: 0 } }}
    >
      <div className="standard-report-editor">
        <div className="standard-report-editor-header">
          <div className="standard-report-editor-nav">
            <Button
              className="standard-report-editor-back"
              color="default"
              variant="text"
              icon={<ArrowLeftOutlined />}
              onClick={closeEditor}
            >
              Go Back
            </Button>
          </div>
          <div className="standard-report-editor-summary">
            <span className="standard-report-editor-kicker">Chart Editor</span>
            <h2 className="standard-report-editor-title">
              {page?.title || '编辑图表'}
            </h2>
          </div>
        </div>

        <div className="standard-report-editor-body">
          {pageBuilder ? <StandardAPP builder={pageBuilder.chart} /> : null}
        </div>
      </div>
    </Drawer>
  );
};
