import { useReportStore } from 'src/model';
import { ReportCarousel } from '../components/stage/ReportCarousel';

export const ReportStage = () => {
  const report = useReportStore((state) => state.report);
  const reportBuilder = useReportStore((state) => state.reportBuilder);
  const revision = useReportStore((state) => state.revision);
  const activePageId = useReportStore((state) => state.activePageId);
  const addPage = useReportStore((state) => state.addPage);
  const removePage = useReportStore((state) => state.removePage);
  const setActivePageId = useReportStore((state) => state.setActivePageId);
  const openEditor = useReportStore((state) => state.openEditor);

  return (
    <ReportCarousel
      activePageId={activePageId}
      pages={report.pages}
      reportBuilder={reportBuilder}
      revision={revision}
      onAdd={addPage}
      onChange={setActivePageId}
      onEdit={openEditor}
      onRemove={removePage}
    />
  );
};
