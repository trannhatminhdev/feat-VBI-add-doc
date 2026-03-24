import { useVBIStore } from 'src/model';
import type { BearState } from 'src/model/VBIStore';

/**
 * VBI Store Hook
 * 提供全局状态管理
 */
export const useVBIStoreHook = (): BearState => {
  return useVBIStore() as BearState;
};
