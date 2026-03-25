import { useMemo } from 'react';
import type { DemoLocale } from 'src/constants/builder';
import { useVBIBuilder } from 'src/hooks';
import { useVBIStore } from 'src/model';
import { createTranslator, type TranslationParams } from './utils';

type UseTranslationResult = {
  locale: DemoLocale;
  setLocale: (locale: DemoLocale) => void;
  t: (key: string, params?: TranslationParams) => string;
};

export const useTranslation = (): UseTranslationResult => {
  const builder = useVBIStore((state) => state.builder);
  const { locale, setLocale } = useVBIBuilder(builder);
  const t = useMemo(() => createTranslator(locale), [locale]);

  return {
    locale,
    setLocale,
    t,
  };
};
