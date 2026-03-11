import { z } from 'zod'

export type TimeGranularity = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'

export interface TimeFormat {
  /**
   * @description 时间粒度，决定日期展示精度
   */
  type: TimeGranularity
}

export const zTimeFormat = z
  .object({
    type: z.enum(['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second']),
  })
  .optional()
