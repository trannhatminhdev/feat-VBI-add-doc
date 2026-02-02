import { describe, test, expect } from 'vitest';
import { VSeedBuilder } from 'src/types/builder/builder';

describe('VSeedBuilder', () => {
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
});
