import * as Y from 'yjs'

/**
 * @description 撤销/重做管理器，提供基于 YJS 的撤销和重做功能，支持栈管理和历史清除操作
 */
export class UndoManager {
  private manager: Y.UndoManager

  /**
   * @description 构造函数
   * @param scope - YJS 文档或类型作用域，用于定义撤销/重做的追踪范围
   */
  constructor(scope: any) {
    this.manager = new Y.UndoManager(scope)
  }

  /**
   * @description 撤销上一次修改
   * @returns 是否成功撤销
   */
  undo(): boolean {
    return this.manager.undo() !== null
  }

  /**
   * @description 重做被撤销的修改
   * @returns 是否成功重做
   */
  redo(): boolean {
    return this.manager.redo() !== null
  }

  /**
   * @description 检查是否有可撤销的操作
   * @returns 是否可以撤销
   */
  canUndo(): boolean {
    return this.manager.canUndo()
  }

  /**
   * @description 检查是否有可重做的操作
   * @returns 是否可以重做
   */
  canRedo(): boolean {
    return this.manager.canRedo()
  }

  /**
   * @description 清除历史记录
   * @param clearUndoStack - 是否清除撤销栈，默认 true
   * @param clearRedoStack - 是否清除重做栈，默认 true
   */
  clear(clearUndoStack?: boolean, clearRedoStack?: boolean): void {
    this.manager.clear(clearUndoStack, clearRedoStack)
  }
}
