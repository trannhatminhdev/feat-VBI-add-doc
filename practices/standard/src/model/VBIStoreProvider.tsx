import type { VBIChartBuilder } from '@visactor/vbi';
import {
  createContext,
  useContext,
  useRef,
  type PropsWithChildren,
} from 'react';
import { useStore } from 'zustand';
import {
  createVBIStore,
  type VBIStoreApi,
  type VBIStoreState,
} from './VBIStore';

const VBIStoreContext = createContext<VBIStoreApi | null>(null);

type VBIStoreProviderProps = PropsWithChildren<{
  builder?: VBIChartBuilder;
}>;

export const VBIStoreProvider = ({
  builder,
  children,
}: VBIStoreProviderProps) => {
  const storeRef = useRef<VBIStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createVBIStore(builder);
  }

  return (
    <VBIStoreContext.Provider value={storeRef.current}>
      {children}
    </VBIStoreContext.Provider>
  );
};

export const useVBIStore = <T,>(selector: (state: VBIStoreState) => T) => {
  const store = useContext(VBIStoreContext);

  if (!store) {
    throw new Error('useVBIStore must be used within VBIStoreProvider');
  }

  return useStore(store, selector);
};
