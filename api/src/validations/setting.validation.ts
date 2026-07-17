import { z } from 'zod';

export const updateGeneralSettingsSchema = z.object({
   body: z
      .object({
         orgName: z.string().min(2).max(200).optional(),
         badgePrefix: z.string().trim().min(1).max(10).optional(),
         overstayEnabled: z.boolean().optional(),
         overstayAfterMins: z.number().int().positive().optional(),
      })
      .refine((data) => Object.keys(data).length > 0, {
         message: 'At least one field is required',
      }),
});
