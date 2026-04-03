import type { Player } from 'src/types'
import { getDarkColorScheme, getLightColorScheme } from './color'

export const getDarkPlayer = (): Omit<Player, 'field'> => {
  const primaryColor = getDarkColorScheme()[0]

  return {
    maxCount: 10,
    interval: 1000,
    loop: false,
    autoPlay: true,
    position: 'bottom',
    fontSize: 36,
    railColor: '#404349',

    trackColor: primaryColor,
    sliderHandleColor: '#232324',
    sliderHandleBorderColor: primaryColor,

    startButtonColor: primaryColor,
    pauseButtonColor: primaryColor,
    backwardButtonColor: primaryColor,
    forwardButtonColor: primaryColor,
  }
}

export const getLightPlayer = (): Omit<Player, 'field'> => {
  const primaryColor = getLightColorScheme()[0]

  return {
    maxCount: 10,
    interval: 1000,
    loop: false,
    autoPlay: true,
    position: 'bottom',
    fontSize: 36,
    railColor: '#f1f3f4',

    trackColor: primaryColor,
    sliderHandleColor: '#ffffff',
    sliderHandleBorderColor: primaryColor,

    startButtonColor: primaryColor,
    pauseButtonColor: primaryColor,
    backwardButtonColor: primaryColor,
    forwardButtonColor: primaryColor,
  }
}
