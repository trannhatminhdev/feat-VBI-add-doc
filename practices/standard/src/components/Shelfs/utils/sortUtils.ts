import type { VBISort } from '@visactor/vbi';
import type { Translate } from 'src/i18n';

export const getSortMenuSelectedKeys = (sort?: VBISort) => {
  if (!sort) {
    return [];
  }

  return [`sort:${sort.order}`];
};

export const formatSortMenuSummary = (
  sort: VBISort | undefined,
  t: Translate,
) => {
  if (!sort) {
    return undefined;
  }

  if (sort.order === 'asc') {
    return t('shelvesSortAsc');
  }

  return t('shelvesSortDesc');
};

export const formatSortDisplaySuffix = (sort?: VBISort) => {
  if (!sort) {
    return '';
  }

  return sort.order === 'asc' ? ' ↑' : ' ↓';
};
