import type { YLinearAxis } from 'src/types'
import { AXIS_LABEL_SPACE, LINEAR_AXIS_INNER_OFFSET_TOP } from 'src/pipeline/utils'

export interface LinearAxisStyleConfig extends YLinearAxis {
  orient: 'left' | 'right' | 'top' | 'bottom'
  formatMethod?: (value: string) => string
  titleText?: string
  id?: string
  seriesId?: string | string[]
  sync?: {
    axisId: string
    zeroAlign: boolean
  }
  isPivot?: boolean
}

export const linearAxisStyle = (config: LinearAxisStyleConfig): any => {
  const {
    orient,
    visible = true,
    label,
    tick,
    title,
    grid,
    line,
    zero,
    nice,
    inverse,
    max,
    min,
    log,
    logBase = 10,
    formatMethod,
    titleText,
    id,
    seriesId,
    sync,
    isPivot = false,
    animation,
  } = config

  const axisConfig: any = {
    ...(isPivot
      ? {
          range: {
            min,
            max,
          },
        }
      : {
          min,
          max,
        }),
    visible,
    type: log ? 'log' : 'linear',
    base: logBase,
    orient,
    nice,
    zero: log ? false : zero,
    inverse,
    label: {
      space: AXIS_LABEL_SPACE,
      visible: label?.visible,
      formatMethod,
      style: {
        fill: label?.labelColor,
        angle: label?.labelAngle,
        fontSize: label?.labelFontSize,
        fontWeight: label?.labelFontWeight,
      },
    },
    title: {
      visible: title?.visible,
      text: titleText,
      style: {
        fill: title?.titleColor,
        fontSize: title?.titleFontSize,
        fontWeight: title?.titleFontWeight,
      },
    },
    tick: {
      visible: tick?.visible,
      tickSize: tick?.tickSize,
      inside: tick?.tickInside,
      style: {
        stroke: tick?.tickColor,
      },
    },
    grid: {
      visible: grid?.visible,
      style: {
        lineWidth: grid?.gridWidth,
        stroke: grid?.gridColor,
        lineDash: grid?.gridLineDash,
      },
    },
    domainLine: {
      visible: line?.visible,
      style: {
        lineWidth: line?.lineWidth,
        stroke: line?.lineColor,
      },
    },
    animation: !!animation,
    animationUpdate: {
      duration: animation?.duration,
      easing: animation?.easing,
    },
  }

  // Add innerOffset based on orientation
  if (orient === 'bottom' || orient === 'top') {
    axisConfig.innerOffset = {
      right: LINEAR_AXIS_INNER_OFFSET_TOP,
    }
  } else {
    axisConfig.innerOffset = {
      top: LINEAR_AXIS_INNER_OFFSET_TOP,
    }
  }

  // Add optional fields
  if (id) {
    axisConfig.id = id
  }
  if (seriesId) {
    axisConfig.seriesId = seriesId
  }
  if (sync) {
    axisConfig.sync = sync
  }

  return axisConfig
}
