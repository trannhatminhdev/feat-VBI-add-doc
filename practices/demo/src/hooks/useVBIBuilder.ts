import { useState, useEffect, useCallback } from 'react';
import { VBIChartBuilder, VBIChartDSL } from '@visactor/vbi';
import {
  DEMO_DEFAULT_LIMIT,
  DEMO_DEFAULT_LOCALE,
  DEMO_DEFAULT_THEME,
  type DemoLocale,
  type DemoTheme,
} from 'src/constants/builder';

export interface VBIBuilderState {
  locale: DemoLocale;
  theme: DemoTheme;
  limit: number;
  connectorId: string;
}

const normalizeLimit = (limit: number) => {
  return Math.max(1, Math.round(limit));
};

/**
 * VBI Builder Hook
 * 提供 VBI Builder 的全局配置管理，包括 locale、theme、limit
 */
export const useVBIBuilder = (builder: VBIChartBuilder | undefined) => {
  const [state, setState] = useState<VBIBuilderState>({
    locale: DEMO_DEFAULT_LOCALE,
    theme: DEMO_DEFAULT_THEME,
    limit: DEMO_DEFAULT_LIMIT,
    connectorId: '',
  });

  // 初始化状态
  useEffect(() => {
    if (!builder) {
      return;
    }

    const dsl = builder.dsl.toJSON() as VBIChartDSL;
    setState({
      locale: (dsl.locale ?? DEMO_DEFAULT_LOCALE) as DemoLocale,
      theme: (dsl.theme ?? DEMO_DEFAULT_THEME) as DemoTheme,
      limit: normalizeLimit(dsl.limit ?? DEMO_DEFAULT_LIMIT),
      connectorId: dsl.connectorId ?? '',
    });

    // 监听 DSL 变化
    const updateHandler = () => {
      const newDsl = builder.dsl.toJSON() as VBIChartDSL;
      setState({
        locale: (newDsl.locale ?? DEMO_DEFAULT_LOCALE) as DemoLocale,
        theme: (newDsl.theme ?? DEMO_DEFAULT_THEME) as DemoTheme,
        limit: normalizeLimit(newDsl.limit ?? DEMO_DEFAULT_LIMIT),
        connectorId: newDsl.connectorId ?? '',
      });
    };

    builder.doc.on('update', updateHandler);
    return () => {
      builder.doc.off('update', updateHandler);
    };
  }, [builder]);

  // 设置语言
  const setLocale = useCallback(
    (locale: DemoLocale) => {
      if (builder) {
        builder.locale.setLocale(locale);
      }
    },
    [builder],
  );

  // 设置主题
  const setTheme = useCallback(
    (theme: DemoTheme) => {
      if (builder) {
        builder.theme.setTheme(theme);
      }
    },
    [builder],
  );

  // 设置数据限制
  const setLimit = useCallback(
    (limit: number) => {
      if (builder) {
        builder.limit.setLimit(normalizeLimit(limit));
      }
    },
    [builder],
  );

  return {
    ...state,
    setLocale,
    setTheme,
    setLimit,
  };
};
