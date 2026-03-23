import { VBI } from '@visactor/vbi'
import { VBIChartDSL } from 'src/types/dsl'

describe('UndoManager', () => {
  test('basic undo/redo', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    // 初始状态
    expect(builder.undoManager.canUndo()).toBe(false)
    expect(builder.undoManager.canRedo()).toBe(false)

    // 添加一个度量
    builder.measures.add('sales', (node) => {
      node.setAlias('Sales')
    })

    // 有可撤销，无可重做
    expect(builder.undoManager.canUndo()).toBe(true)
    expect(builder.undoManager.canRedo()).toBe(false)

    // 撤销
    const undoResult = builder.undoManager.undo()
    expect(undoResult).toBe(true)
    expect(builder.undoManager.canUndo()).toBe(false)
    expect(builder.undoManager.canRedo()).toBe(true)

    // 重做
    const redoResult = builder.undoManager.redo()
    expect(redoResult).toBe(true)
    expect(builder.undoManager.canUndo()).toBe(true)
    expect(builder.undoManager.canRedo()).toBe(false)
  })

  test('clear', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    builder.measures.add('sales', (node) => {
      node.setAlias('Sales')
    })

    expect(builder.undoManager.canUndo()).toBe(true)

    builder.undoManager.clear()

    expect(builder.undoManager.canUndo()).toBe(false)
    expect(builder.undoManager.canRedo()).toBe(false)
  })

  test('undo returns false when nothing to undo', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    const result = builder.undoManager.undo()
    expect(result).toBe(false)
  })

  test('redo returns false when nothing to redo', () => {
    const builder = VBI.createChart({} as VBIChartDSL)

    const result = builder.undoManager.redo()
    expect(result).toBe(false)
  })
})
