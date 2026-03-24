import { type VBIReportBuilder, type VBIReportDSL } from '@visactor/vbi';
import { create } from 'zustand';
import { connectorId, defaultReportBuilder } from 'src/utils/demoConnector';
import {
  addReportPage,
  ensureReportHasPage,
  getFallbackActivePageId,
} from 'src/utils/report-pages';

type DestroyCallback = () => void;

export interface EditorSourceRect {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface ReportStoreState {
  reportBuilder: VBIReportBuilder;
  report: VBIReportDSL;
  initialized: boolean;
  revision: number;
  activePageId: string;
  editorOpen: boolean;
  editorSourceRect: EditorSourceRect | null;
  initialize: (builder?: VBIReportBuilder) => DestroyCallback;
  bindEvents: () => DestroyCallback;
  syncReport: () => void;
  addPage: () => void;
  removePage: (pageId: string) => void;
  updatePageTitle: (pageId: string, title: string) => void;
  setActivePageId: (pageId: string) => void;
  openEditor: (pageId?: string, sourceRect?: EditorSourceRect | null) => void;
  closeEditor: () => void;
}

const getSnapshot = (reportBuilder: VBIReportBuilder, activePageId: string) => {
  const report = reportBuilder.build();
  const nextActivePageId = report.pages.some((page) => page.id === activePageId)
    ? activePageId
    : (report.pages[0]?.id ?? '');

  return { report, activePageId: nextActivePageId };
};

const initialReport = defaultReportBuilder.build();

export const useReportStore = create<ReportStoreState>((set, get) => ({
  reportBuilder: defaultReportBuilder,
  report: initialReport,
  initialized: false,
  revision: 0,
  activePageId: initialReport.pages[0]?.id ?? '',
  editorOpen: false,
  editorSourceRect: null,

  setActivePageId: (activePageId) => set({ activePageId }),
  openEditor: (pageId, sourceRect) =>
    set((state) => ({
      editorOpen: true,
      editorSourceRect: sourceRect ?? null,
      activePageId: pageId ?? state.activePageId,
    })),
  closeEditor: () => set({ editorOpen: false, editorSourceRect: null }),

  updatePageTitle: (pageId, title) => {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    get().reportBuilder.page.update(pageId, (page) => page.setTitle(nextTitle));
    get().syncReport();
  },

  syncReport: () => {
    const snapshot = getSnapshot(get().reportBuilder, get().activePageId);
    set((state) => ({ ...snapshot, revision: state.revision + 1 }));
  },

  bindEvents: () => {
    const update = () => get().syncReport();
    get().reportBuilder.doc.on('update', update);
    return () => get().reportBuilder.doc.off('update', update);
  },

  initialize: (builder) => {
    const reportBuilder = builder ?? get().reportBuilder;
    const activePageId = ensureReportHasPage(reportBuilder, connectorId);
    set({ reportBuilder, activePageId, initialized: true });
    const dispose = get().bindEvents();
    get().syncReport();
    return () => {
      dispose();
      set({ editorOpen: false, editorSourceRect: null, initialized: false });
    };
  },

  addPage: () => {
    const activePageId = addReportPage(get().reportBuilder, connectorId);
    set({ activePageId });
    get().syncReport();
  },

  removePage: (pageId) => {
    const pages = get().reportBuilder.build().pages;
    const activePageId = getFallbackActivePageId(
      pages,
      pageId,
      get().activePageId,
    );
    get().reportBuilder.page.remove(pageId);
    const ensuredPageId =
      get().reportBuilder.build().pages[0]?.id ??
      addReportPage(get().reportBuilder, connectorId);
    set({ activePageId: activePageId || ensuredPageId });
    get().syncReport();
  },
}));
