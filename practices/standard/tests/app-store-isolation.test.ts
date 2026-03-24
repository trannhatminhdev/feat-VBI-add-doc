import { expect, rs, test } from '@rstest/core';
import { waitFor } from '@testing-library/react';
import { createVBIStore } from '../src/model';
import { createDefaultBuilder } from '../src/utils/demoConnector';

test('createVBIStore creates isolated instances', () => {
  const storeA = createVBIStore();
  const storeB = createVBIStore();
  const builder = createDefaultBuilder();
  const dispose = storeA.getState().initialize(builder);

  storeA.getState().setLoading(true);

  expect(storeA.getState().builder).toBe(builder);
  expect(storeB.getState().builder).not.toBe(builder);
  expect(storeA.getState().initialized).toBe(true);
  expect(storeB.getState().initialized).toBe(false);
  expect(storeA.getState().loading).toBe(true);
  expect(storeB.getState().loading).toBe(false);

  dispose();
});

test('stores sharing a builder reuse the same VSeed request', async () => {
  const buildVSeed = rs.fn().mockResolvedValue({ spec: {} });
  const builder = {
    dsl: {
      toJSON: () => ({
        chartType: 'table',
        dimensions: [{ field: 'area' }],
        measures: [{ field: 'sales' }],
      }),
    },
    doc: {
      on() {},
      off() {},
    },
    isEmpty: () => false,
    build: () => ({}),
    buildVQuery: () => ({}),
    buildVSeed,
  } as any;
  const storeA = createVBIStore();
  const storeB = createVBIStore();
  const disposeA = storeA.getState().initialize(builder);
  const disposeB = storeB.getState().initialize(builder);

  await waitFor(() => {
    expect(buildVSeed).toHaveBeenCalledTimes(1);
    expect(storeA.getState().vseed).not.toBeNull();
    expect(storeB.getState().vseed).not.toBeNull();
  });

  disposeA();
  disposeB();
});
