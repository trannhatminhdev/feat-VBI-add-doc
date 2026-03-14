import { useState, useEffect, useCallback } from 'react';
import { VBIBuilder } from '@visactor/vbi';

/**
 * VBI Undo Manager Hook
 * 提供撤销/重做管理
 */
export const useVBIUndoManager = (builder: VBIBuilder | undefined) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!builder) {
      return;
    }

    // 初始化状态
    setCanUndo(builder.undoManager.canUndo());
    setCanRedo(builder.undoManager.canRedo());

    // 监听变化
    const updateHandler = () => {
      setCanUndo(builder.undoManager.canUndo());
      setCanRedo(builder.undoManager.canRedo());
    };

    builder.doc.on('update', updateHandler);
    return () => {
      builder.doc.off('update', updateHandler);
    };
  }, [builder]);

  // 撤销
  const undo = useCallback(() => {
    if (builder && builder.undoManager.canUndo()) {
      return builder.undoManager.undo();
    }
    return false;
  }, [builder]);

  // 重做
  const redo = useCallback(() => {
    if (builder && builder.undoManager.canRedo()) {
      return builder.undoManager.redo();
    }
    return false;
  }, [builder]);

  // 清除历史记录
  const clear = useCallback(
    (clearUndoStack = true, clearRedoStack = true) => {
      if (builder) {
        builder.undoManager.clear(clearUndoStack, clearRedoStack);
        setCanUndo(false);
        setCanRedo(false);
      }
    },
    [builder],
  );

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clear,
  };
};
