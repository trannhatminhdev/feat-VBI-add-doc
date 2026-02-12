import { describe, test, expect, beforeAll } from 'vitest';
import { VSeedBuilder,  } from 'src/types/builder/builder';
import { Builder } from 'src/builder';
import { registerAll } from 'src/builder/register/all';
import type { PivotChartConstructorOptions } from '@visactor/vtable';

describe('VSeedBuilder', () => {
  beforeAll(() => {
    registerAll();
  });

  test('should be defined', () => {
    expect(VSeedBuilder).toBeDefined();
  });

  test('should be extendable', () => {
    class ConcreteBuilder extends VSeedBuilder {
      build = () => ({}) as any;
      buildAdvanced = () => null;
      buildSpec = () => ({}) as any;
      getColorItems = () => [];
      getColorIdMap = () => ({});
      prepare = async () => {};
      
      private _spec: any = null;
      get spec() { return this._spec; }
      set spec(value: any) { this._spec = value; }
      
      private _vseed: any = {};
      get vseed() { return this._vseed; }
      set vseed(value: any) { this._vseed = value; }
      
      private _advancedVSeed: any = null;
      get advancedVSeed() { return this._advancedVSeed; }
      set advancedVSeed(value: any) { this._advancedVSeed = value; }
    }

    const builder = new ConcreteBuilder();
    expect(builder).toBeInstanceOf(VSeedBuilder);
    expect(builder.build()).toBeDefined();
    expect(builder.getColorItems()).toEqual([]);
  });

  test('spec chart type as const', () => {
    const testVseed = { chartType: 'table' as const, dataset: [{a:1}] } 
    const testSpec = Builder.from(testVseed).build()
    expect(testSpec).toBeDefined()
  })

  test('spec chart template', () => {
    const testVseed = { 
      chartType: 'column' as const,
      dataset: [{ a: 'test', b: 2 }], 
      dimension:[{ id: 'a', encoding: 'row' }],
      measures: [{ id: 'b'}]
    } 
    const testSpec1 = Builder.from<PivotChartConstructorOptions>(testVseed).build()
    const testSpec2 = Builder.from(testVseed).build<PivotChartConstructorOptions>()
    expect(testSpec1).toBeDefined()
    expect(testSpec2).toBeDefined()
  })
});
