import { z } from 'zod';

export const createDepartmentSchema = z.object({
   name: z
      .string()
      .min(2, 'Department name is required')
      .max(100, 'Department name must be 100 characters or fewer'),
   shortName: z
      .string()
      .trim()
      .max(10, 'Short name must be 10 characters or fewer')
      .regex(
         /^[A-Za-z0-9&/().,\- ]*$/,
         'Short name may only contain letters, numbers, spaces, &, /, ., (, ), comma, and -',
      )
      .optional(),
   color: z
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
});

export type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>;
