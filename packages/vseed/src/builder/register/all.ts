import {
  registerArea,
  registerAreaPercent,
  registerBar,
  registerRaceBar,
  registerBarParallel,
  registerBarPercent,
  registerColumn,
  registerColumnParallel,
  registerColumnPercent,
  registerLine,
  registerPie,
  registerDonut,
  registerRose,
  registerRoseParallel,
  registerFunnel,
  registerScatter,
  registerTable,
  registerPivotTable,
  registerHeatmap,
  registerRadar,
  registerDualAxis,
  registerBoxPlot,
  registerHistogram,
} from './chartType'
import { registerDarkTheme, registerLightTheme } from './theme'
/**
 * @description 注册所有内置的图表类型和主题。
 * 包括：表格、透视表、折线图、柱状图、饼图、散点图等所有支持的图表，以及浅色/深色主题。
 * 在初始化应用时调用此函数，以确保所有功能可用。
 */
export const registerAll = () => {
  // table
  registerTable()
  registerPivotTable()
  // cartesian
  registerLine()
  registerColumn()
  registerColumnParallel()
  registerColumnPercent()
  registerBar()
  registerRaceBar()
  registerBarParallel()
  registerBarPercent()
  registerArea()
  registerAreaPercent()
  registerScatter()
  registerDualAxis()
  // polar
  registerPie()
  registerDonut()
  registerRose()
  registerRoseParallel()
  registerRadar()
  // other
  registerFunnel()
  registerHeatmap()
  registerBoxPlot()
  registerHistogram()
  // theme
  registerLightTheme()
  registerDarkTheme()
}
