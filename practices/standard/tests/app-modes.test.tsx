import { expect, test } from '@rstest/core';
import { render, screen, waitFor } from '@testing-library/react';
import { APP } from '../src/App';
import { createDefaultBuilder } from '../src/utils/demoConnector';

test('APP keeps edit workbench as the default mode', async () => {
  const view = render(<APP builder={createDefaultBuilder()} />);

  expect(await screen.findByPlaceholderText('搜索')).toBeInTheDocument();
  expect(screen.getByText('暂时为空')).toBeInTheDocument();

  view.unmount();
});

test('APP hides editor controls in view mode', async () => {
  const view = render(<APP builder={createDefaultBuilder()} mode="view" />);

  expect(await screen.findByText('暂时为空')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByPlaceholderText('搜索')).not.toBeInTheDocument();
  });

  view.unmount();
});
