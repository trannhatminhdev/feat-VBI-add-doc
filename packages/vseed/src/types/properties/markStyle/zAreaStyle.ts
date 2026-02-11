import { z } from 'zod'
import { zChartDynamicFilter, zSelector, zSelectors } from '../../dataSelector'

export const zAreaStyle = z.object({
  selector: z.union([zSelector, zSelectors]).nullish(),
  dynamicFilter: zChartDynamicFilter.optional(),
  areaVisible: z.boolean().nullish(),
  areaColor: z.string().nullish(),
  areaColorOpacity: z.number().nullish(),
})
