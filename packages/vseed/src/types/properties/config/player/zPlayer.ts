import { z } from 'zod'

export const zPlayer = z.object({
  field: z.string(),
  interval: z.number().optional(),
  autoPlay: z.boolean().optional(),
  loop: z.boolean().optional(),
  position: z.enum(['top', 'bottom', 'left', 'right']).optional(),

  railColor: z.string().optional(),
  trackColor: z.string().optional(),
  sliderHandleColor: z.string().optional(),

  startButtonColor: z.string().optional(),
  pauseButtonColor: z.string().optional(),
  backwardButtonColor: z.string().optional(),
  forwardButtonColor: z.string().optional(),
})
