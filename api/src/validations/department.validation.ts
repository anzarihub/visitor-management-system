import { z } from 'zod';
import { idParamSchema } from './shared.validation.js';

export const getDepartmentsSchema = z.object({
   query: z.object({
      activeOnly: z
         .enum(['true', 'false'])
         .optional()
         .transform((val) => val === 'true'),
   }),
});

const hexColorSchema = z
   .string()
   .trim()
   .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color');

export const createDepartmentSchema = z.object({
   body: z.object({
      name: z.string().min(2).max(100),
      shortName: z
         .string()
         .trim()
         .max(10, 'Short name must be 10 characters or fewer')
         .regex(
            /^[A-Za-z0-9&/().,\- ]*$/,
            'Short name may only contain letters, numbers, spaces, &, /, ., (, ), comma, and -',
         )
         .optional(),
      color: hexColorSchema,
   }),
});

export const updateDepartmentSchema = z.object({
   params: idParamSchema.shape.params,

   body: z.object({
      name: z.string().min(2).max(100),
      shortName: z
         .string()
         .trim()
         .max(10, 'Short name must be 10 characters or fewer')
         .regex(
            /^[A-Za-z0-9&/().,\- ]*$/,
            'Short name may only contain letters, numbers, spaces, &, /, ., (, ), comma, and -',
         )
         .optional(),
      color: hexColorSchema,
   }),
});

export const updateDepartmentStatusSchema = z.object({
   params: idParamSchema.shape.params,

   body: z.object({
      isActive: z.boolean(),
   }),
});
