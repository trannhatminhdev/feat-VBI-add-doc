import { z } from 'zod'

export const zTotalType = z.enum(['sum', 'avg', 'max', 'min', 'count'])
