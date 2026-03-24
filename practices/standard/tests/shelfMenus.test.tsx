import { expect, test } from '@rstest/core';
import { fireEvent, render, screen } from '@testing-library/react';
import { MeasureFormatPanel } from '../src/components/Shelfs/common/MeasureFormatPanel';
import {
  getDimensionMenuSelectedKeys,
  getMeasureMenuSelectedKeys,
} from '../src/components/Shelfs/utils/menuSelectionUtils';

test('getMeasureMenuSelectedKeys marks encoding and aggregate', () => {
  expect(
    getMeasureMenuSelectedKeys({
      encoding: 'primaryYAxis',
      aggregate: { func: 'sum' },
    }),
  ).toEqual(['encoding:primaryYAxis', 'aggregate:sum']);
});

test('getMeasureMenuSelectedKeys keeps quantile submenu state', () => {
  expect(
    getMeasureMenuSelectedKeys({
      aggregate: { func: 'quantile', quantile: 0.75 },
    }),
  ).toEqual(['aggregate:quantile', 'aggregate:quantile:75']);
});

test('getDimensionMenuSelectedKeys falls back to raw value for date fields', () => {
  expect(
    getDimensionMenuSelectedKeys(
      {
        encoding: 'xAxis',
      },
      'date',
    ),
  ).toEqual(['encoding:xAxis', 'aggregate:none']);
});

test('MeasureFormatPanel switches to custom mode in submenu panel', () => {
  const changes: unknown[] = [];

  render(
    <MeasureFormatPanel
      format={{ autoFormat: true }}
      onFormatChange={(value) => changes.push(value)}
    />,
  );

  fireEvent.click(screen.getByText('自定义'));

  expect(changes).toContainEqual({
    type: 'number',
    fractionDigits: 2,
  });
  expect(screen.getByText('清除格式')).toBeInTheDocument();
});
