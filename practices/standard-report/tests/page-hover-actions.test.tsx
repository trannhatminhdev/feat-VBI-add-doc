import { expect, test } from '@rstest/core';
import { fireEvent, render, within } from '@testing-library/react';
import { PageHoverActions } from '../src/App/components/page/PageHoverActions';

test('renders edit action in the shared toolbar with placeholder label', () => {
  let edited = 0;

  const view = render(
    <PageHoverActions
      canRemove
      showPlaceholder
      onAddPage={() => undefined}
      onEdit={() => {
        edited += 1;
      }}
      onRemovePage={() => undefined}
    />,
  );

  const toolbar = within(view.container).getByTestId('standard-report-actions');
  const editButton = within(toolbar).getByRole('button', {
    name: '添加当前图表',
  });
  fireEvent.click(editButton);

  expect(editButton).toBeInTheDocument();
  expect(edited).toBe(1);
});

test('renders edit, add and remove actions in the shared toolbar', () => {
  const view = render(
    <PageHoverActions
      canRemove
      showPlaceholder={false}
      onAddPage={() => undefined}
      onEdit={() => undefined}
      onRemovePage={() => undefined}
    />,
  );

  const toolbar = within(view.container).getByTestId('standard-report-actions');
  expect(
    within(toolbar).getByRole('button', { name: '编辑当前图表' }),
  ).toBeInTheDocument();
  expect(
    within(toolbar).getByRole('button', { name: '新增一页' }),
  ).toBeInTheDocument();
  expect(
    within(toolbar).getByRole('button', { name: '删除当前页' }),
  ).toBeInTheDocument();
});
