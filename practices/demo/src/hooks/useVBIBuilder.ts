import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder, VBIDSL } from '@visactor/vbi';

export interface VBIBuilderState {
  locale: string;
  theme: string;
  limit: number;
  connectorId: string;
}

/**
 * VBI Builder Hook
 * 提供 VBI Builder 的全局配置管理，包括 locale、theme、limit
 */
export const useVBIBuilder = (builder: VBIBuilder | undefined) => {
  const [state, setState] = useState<VBIBuilderState>({
    locale: 'zh-CN',
    theme: 'light',
    limit: 1000,
    connectorId: '',
  });

  // 初始化状态
  useEffect(() => {
    if (!builder) {
      return;
    }

    const dsl = builder.dsl.toJSON() as VBIDSL;
    setState({
      locale: dsl.locale ?? 'zh-CN',
      theme: dsl.theme ?? 'light',
      limit: dsl.limit ?? 1000,
      connectorId: dsl.connectorId ?? '',
    });

    // 监听 DSL 变化
    const updateHandler = () => {
      const newDsl = builder.dsl.toJSON() as VBIDSL;
      setState({
        locale: newDsl.locale ?? 'zh-CN',
        theme: newDsl.theme ?? 'light',
        limit: newDsl.limit ?? 1000,
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
    (locale: string) => {
      if (builder) {
        builder.locale.setLocale(locale);
      }
    },
    [builder],
  );

  // 设置主题
  const setTheme = useCallback(
    (theme: string) => {
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
        builder.limit.setLimit(limit);
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
