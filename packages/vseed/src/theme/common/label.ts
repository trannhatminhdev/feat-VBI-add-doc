export const getDefaultLabel = () => ({
  enable: true,
  wrap: true,
  showValue: true,
  showValuePercent: false,
  labelFontSize: 12,
  labelColorSmartInvert: false,
  labelOverlap: true,
})

export const getDarkLabel = () => ({
  ...getDefaultLabel(),
  labelStroke: '#21252C',
})

export const getLightLabel = () => ({
  ...getDefaultLabel(),
  labelStroke: '#fff',
})

export const getFunnelDarkLabel = () => ({
  ...getDefaultLabel(),
  labelColor: '#fff',
})

export const getFunnelLightLabel = () => ({
  ...getDefaultLabel(),
  labelColor: '#fff',
})
