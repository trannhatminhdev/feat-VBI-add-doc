import { ConfigProvider } from 'antd';
import { useReportStore } from 'src/model';
import { ReportEditorDrawer } from '../components/editor/ReportEditorDrawer';
import { ReportStage } from './ReportStage';
import {
  REPORT_ANTD_LOCALES,
  createThemeConfig,
  getActiveViewConfig,
} from './view-config';

export const ReportWorkbench = () => {
  const reportBuilder = useReportStore((state) => state.reportBuilder);
  const activePageId = useReportStore((state) => state.activePageId);
  const viewConfig = getActiveViewConfig(reportBuilder, activePageId);

  return (
    <ConfigProvider
      locale={REPORT_ANTD_LOCALES[viewConfig.locale]}
      theme={createThemeConfig(viewConfig.theme)}
      componentSize="small"
    >
      <ReportStage />
      <ReportEditorDrawer />
    </ConfigProvider>
  );
};
