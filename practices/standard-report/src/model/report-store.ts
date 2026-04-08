import { VBI, type VBIReportBuilder, type VBIReportDSL } from '@visactor/vbi';
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
  vbi: typeof VBI;
  reportBuilder: VBIReportBuilder;
  report: VBIReportDSL;
  initialized: boolean;
  revision: number;
  activePageId: string;
  editorOpen: boolean;
  editorSourceRect: EditorSourceRect | null;
  initialize: (
    reportBuilder?: VBIReportBuilder,
    vbi?: typeof VBI,
  ) => DestroyCallback;
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
  vbi: VBI,
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

  initialize: (reportBuilder, vbi) => {
    const nextReportBuilder = reportBuilder ?? get().reportBuilder;
    const nextVBI = vbi ?? get().vbi;
    const activePageId = ensureReportHasPage(
      nextReportBuilder,
      connectorId,
      nextVBI,
    );
    set({
      reportBuilder: nextReportBuilder,
      activePageId,
      initialized: true,
      vbi: nextVBI,
    });
    const dispose = get().bindEvents();
    get().syncReport();
    return () => {
      dispose();
      set({ editorOpen: false, editorSourceRect: null, initialized: false });
    };
  },

  addPage: () => {
    const activePageId = addReportPage(get().reportBuilder, connectorId, {
      vbi: get().vbi,
    });
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
      addReportPage(get().reportBuilder, connectorId, { vbi: get().vbi });
    set({ activePageId: activePageId || ensuredPageId });
    get().syncReport();
  },
}));
