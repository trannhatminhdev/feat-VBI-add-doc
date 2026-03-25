import type { VBIReportDSL } from '@visactor/vbi';
import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import {
  REPORT_DEFAULT_LOCALE,
  REPORT_DEFAULT_THEME,
  type ReportLocale,
  type ReportTheme,
} from 'src/constants/builder';

export const REPORT_ANTD_LOCALES = {
  'zh-CN': zhCN,
  'en-US': enUS,
} as const;

export const createThemeConfig = (themeMode: ReportTheme): ThemeConfig => ({
  algorithm:
    themeMode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: themeMode === 'dark' ? '#6ea8ff' : '#1677ff',
    borderRadius: 10,
    borderRadiusLG: 14,
    borderRadiusOuter: 22,
    borderRadiusSM: 8,
    borderRadiusXS: 6,
  },
});

export const getActiveViewConfig = (
  report: VBIReportDSL,
  activePageId: string,
) => {
  const activePage = report.pages.find((page) => page.id === activePageId);
  return {
    locale: (activePage?.chart.locale ?? REPORT_DEFAULT_LOCALE) as ReportLocale,
    theme: (activePage?.chart.theme ?? REPORT_DEFAULT_THEME) as ReportTheme,
  };
};
