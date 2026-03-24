import { VBIChartBuilder, VBIChartDSL } from '@visactor/vbi';
import { VSeed } from '@visactor/vseed';
import { defaultBuilder } from 'src/utils/demoConnector';
import { create } from 'zustand';

type DestroyCallback = () => void;

export interface BearState {
  loading: boolean;
  vseed: VSeed | null;
  builder: VBIChartBuilder;
  initialized: boolean;

  dsl: VBIChartDSL;

  initialize: (builder?: VBIChartBuilder) => DestroyCallback;
  bindEvent: () => DestroyCallback;
  logState: () => Promise<void>;

  setDsl: (dsl: VBIChartDSL) => void;
  setLoading: (loading: boolean) => void;
  setVSeed: (vseed: VSeed | null) => void;
}

export const useVBIStore = create<BearState>((set, get) => ({
  loading: false,
  vseed: null,
  initialized: false,
  builder: defaultBuilder,
  dsl: defaultBuilder.dsl.toJSON() as VBIChartDSL,

  setLoading: (loading: boolean) => set({ loading }),
  setVSeed: (vseed: VSeed | null) => set({ vseed }),
  setDsl: (dsl: VBIChartDSL) => set({ dsl }),
  logState: async () => {
    const { builder, vseed } = get();

    console.group('selected builder');

    console.info('builder', builder);
    console.info('vbi', builder.build());
    console.info('vquery', builder.buildVQuery());
    console.info('vseed', vseed);

    console.groupEnd();
  },

  // 初始化
  initialize: (builder?: VBIChartBuilder) => {
    if (builder) {
      set({ builder });
    }
    set({ initialized: true });

    const callback = get().bindEvent();

    return () => {
      callback();
      set({ loading: false, vseed: null, initialized: false });
    };
  },

  bindEvent: () => {
    const { builder, setLoading, setVSeed, setDsl } = get();

    const updateAll = async () => {
      if (builder.isEmpty()) {
        setLoading(false);
        setVSeed(null);
        return;
      }

      setLoading(true);
      try {
        const newVSeed = await builder.buildVSeed();
        setVSeed(newVSeed);
        setDsl(builder.dsl.toJSON() as VBIChartDSL);
      } catch (e: any) {
        console.error('VSeed Build Error:', e);
        // 静默处理错误，不显示消息
      } finally {
        setLoading(false);
      }
    };

    builder.doc.on('update', updateAll);
    return () => {
      builder.doc.off('update', updateAll);
    };
  },
}));
