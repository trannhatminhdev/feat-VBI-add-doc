import { z } from 'zod'
import { zLocale } from '../../i18n'

import {
  zBackgroundColor,
  zColor,
  zDataset,
  zDimensions,
  zEncoding,
  zLegend,
  zMeasures,
  zPieLabel,
  zTheme,
  zTooltip,
  zBrush,
  zPage,
  zPlayer,
} from '../../properties'

export const zRaceDonut = z.object({
  chartType: z.literal('raceDonut'),
  dataset: zDataset.nullish(),
  encoding: zEncoding.nullish(),
  dimensions: zDimensions.nullish(),
  measures: zMeasures.nullish(),
  page: zPage.nullish(),
  player: zPlayer.nullish(),

  backgroundColor: zBackgroundColor.nullish(),
  color: zColor.nullish(),
  label: zPieLabel.nullish(),
  legend: zLegend.nullish(),
  tooltip: zTooltip.nullish(),
  brush: zBrush.nullish(),
  theme: zTheme.nullish(),
  locale: zLocale.nullish(),
})
