import { z } from 'zod';

export const badgeVerificationSchema = z.object({
   badgeNumber: z
      .string()
      .length(3, 'Badge number must be exactly 3 digits')
      .regex(/^\d{3}$/, 'Badge number must contain only digits'),
});

export const checkOutNotesSchema = z.object({
   notes: z
      .string()
      .max(500, 'Notes must be 500 characters or fewer')
      .optional(),
});

// Full schema — merge of both steps
export const checkOutSchema = badgeVerificationSchema.extend(
   checkOutNotesSchema.shape,
);

export type BadgeVerificationValues = z.infer<typeof badgeVerificationSchema>;
export type CheckOutNotesValues = z.infer<typeof checkOutNotesSchema>;
export type CheckOutFormValues = z.infer<typeof checkOutSchema>;
