import { expect, test } from '@rstest/core';
import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { PagePreviewCanvas } from '../src/App/components/page/PagePreviewCanvas';
import { createDefaultBuilder } from '../../standard/src/utils/demoConnector';

test('page preview canvas reuses standard view mode without editor controls', async () => {
  render(
    <PagePreviewCanvas
      builder={createDefaultBuilder()}
      pageId="page-1"
      previewRef={createRef<HTMLDivElement>()}
      showPlaceholder={false}
      onEdit={() => undefined}
    />,
  );

  expect(await screen.findByText('暂时为空')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByPlaceholderText('搜索')).not.toBeInTheDocument();
  });
});

test('empty preview keeps the full-card edit entry', async () => {
  let edited = 0;

  render(
    <PagePreviewCanvas
      builder={createDefaultBuilder()}
      pageId="page-2"
      previewRef={createRef<HTMLDivElement>()}
      showPlaceholder
      onEdit={() => {
        edited += 1;
      }}
    />,
  );

  const button = await screen.findByRole('button');
  fireEvent.click(button);

  expect(edited).toBe(1);
});
