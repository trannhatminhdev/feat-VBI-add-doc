declare module 'standard' {
  import type { VBIChartBuilder } from '@visactor/vbi';
  import type { ComponentType } from 'react';
  import type { VSeed } from '@visactor/vseed';

  export const APP: ComponentType<{
    builder?: VBIChartBuilder;
    mode?: 'view' | 'edit';
  }>;

  export const VSeedRender: ComponentType<{
    vseed: VSeed;
  }>;
}
