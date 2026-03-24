export const DEMO_DEFAULT_LOCALE = 'zh-CN' as const;
export const DEMO_DEFAULT_THEME = 'light' as const;
export const DEMO_DEFAULT_LIMIT = 1000;
export const DEMO_MAX_LIMIT = 1000;

export const DEMO_SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const;
export const DEMO_SUPPORTED_THEMES = ['light', 'dark'] as const;

export type DemoLocale = (typeof DEMO_SUPPORTED_LOCALES)[number];
export type DemoTheme = (typeof DEMO_SUPPORTED_THEMES)[number];
