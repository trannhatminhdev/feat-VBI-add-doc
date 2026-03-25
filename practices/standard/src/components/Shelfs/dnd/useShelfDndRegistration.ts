import { useEffect } from 'react';
import { useShelfDndContext } from './ShelfDndProvider';
import type { ShelfDndAdapter } from './types';

export const useShelfDndRegistration = (adapter: ShelfDndAdapter) => {
  const { registerShelf } = useShelfDndContext();

  useEffect(() => {
    return registerShelf(adapter);
  }, [adapter, registerShelf]);
};
