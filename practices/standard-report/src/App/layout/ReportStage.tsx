import { useCallback } from 'react';
import { useReportStore } from 'src/model';
import { readEditorSourceRect } from '../components/editor/transition-utils';
import { ReportCarousel } from '../components/stage/ReportCarousel';

export const ReportStage = () => {
  const report = useReportStore((state) => state.report);
  const reportBuilder = useReportStore((state) => state.reportBuilder);
  const activePageId = useReportStore((state) => state.activePageId);
  const addPage = useReportStore((state) => state.addPage);
  const removePage = useReportStore((state) => state.removePage);
  const setActivePageId = useReportStore((state) => state.setActivePageId);
  const openEditor = useReportStore((state) => state.openEditor);
  const handleOpenEditor = useCallback(
    (pageId: string, sourceElement?: HTMLElement | null) => {
      openEditor(pageId, readEditorSourceRect(sourceElement));
    },
    [openEditor],
  );

  return (
    <ReportCarousel
      activePageId={activePageId}
      pages={report.pages}
      reportBuilder={reportBuilder}
      onAdd={addPage}
      onChange={setActivePageId}
      onEdit={handleOpenEditor}
      onRemove={removePage}
    />
  );
};
