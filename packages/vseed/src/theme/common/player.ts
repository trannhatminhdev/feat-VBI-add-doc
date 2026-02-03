import type { Player } from 'src/types'
import { getDarkColorScheme, getLightColorScheme } from './color'
import { getDarkColorLegend, getLightColorLegend } from './legend'

export const getDarkPlayer = (): Omit<Player, 'field'> => {
  const primaryColor = getDarkColorScheme()[0]
  const railColor = getDarkColorLegend().railBackgroundColor

  return {
    interval: 1000,
    loop: false,
    autoPlay: true,
    position: 'bottom',
    railColor,
    trackColor: primaryColor,
    sliderHandleColor: primaryColor,

    startButtonColor: primaryColor,
    pauseButtonColor: primaryColor,
    backwardButtonColor: primaryColor,
    forwardButtonColor: primaryColor,
  }
}

export const getLightPlayer = (): Omit<Player, 'field'> => {
  const primaryColor = getLightColorScheme()[0]
  const railColor = getLightColorLegend().railBackgroundColor

  return {
    interval: 1000,
    loop: false,
    autoPlay: true,
    position: 'bottom',
    railColor,
    trackColor: primaryColor,
    sliderHandleColor: primaryColor,

    startButtonColor: primaryColor,
    pauseButtonColor: primaryColor,
    backwardButtonColor: primaryColor,
    forwardButtonColor: primaryColor,
  }
}
