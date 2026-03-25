import { useVBIStore } from 'src/model';
import type { VBIStoreState } from 'src/model/VBIStore';

/**
 * VBI Store Hook
 * 提供全局状态管理
 */
export const useVBIStoreHook = (): VBIStoreState => {
  return useVBIStore((state) => state);
};
