import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';
import type { DemoLocale } from 'src/constants/builder';

export type TranslationParams = Record<
  string,
  string | number | boolean | null | undefined
>;
export type Translate = (key: string, params?: TranslationParams) => string;

type TranslationMessages = typeof zhCN;

const messages: Record<DemoLocale, TranslationMessages> = {
  'zh-CN': zhCN,
  'en-US': enUS,
};

const getMessage = (messagesObject: TranslationMessages, key: string) => {
  if (!Object.prototype.hasOwnProperty.call(messagesObject, key)) {
    return undefined;
  }

  return messagesObject[key as keyof TranslationMessages];
};

const formatMessage = (message: string, params?: TranslationParams) => {
  if (!params) {
    return message;
  }

  return message.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) => {
    const value = params[key];
    return value === undefined || value === null ? match : String(value);
  });
};

export const translate = (
  locale: DemoLocale,
  key: string,
  params?: TranslationParams,
) => {
  const message = getMessage(messages[locale], key);

  if (typeof message !== 'string') {
    return key;
  }

  return formatMessage(message, params);
};

export const createTranslator = (locale: DemoLocale) => {
  return (key: string, params?: TranslationParams) =>
    translate(locale, key, params);
};
