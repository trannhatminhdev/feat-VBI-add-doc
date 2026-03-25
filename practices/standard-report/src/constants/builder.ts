export const REPORT_DEFAULT_LOCALE = 'zh-CN' as const;
export const REPORT_DEFAULT_THEME = 'light' as const;

export const REPORT_SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const;
export const REPORT_SUPPORTED_THEMES = ['light', 'dark'] as const;

export type ReportLocale = (typeof REPORT_SUPPORTED_LOCALES)[number];
export type ReportTheme = (typeof REPORT_SUPPORTED_THEMES)[number];
