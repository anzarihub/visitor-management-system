import { z } from 'zod';
import { IdType } from '../generated/prisma/enums.js';

const badgeNumberField = z.coerce
   .number({ message: 'Badge number is required' })
   .int('Badge number must be a whole number')
   .min(1, 'Badge number is required')
   .max(999, 'Badge number must be 3 digits or fewer');

export const checkInVisitorSchema = z.object({
   body: z.object({
      fullName: z.string().trim().min(1, 'Full name is required'),
      phone: z.string().trim().optional(),
      idType: z.enum(IdType),
      idNumber: z.string().trim().min(1, 'ID number is required'),
      host: z.string().trim().min(1, 'Host name is required'),
      departmentId: z.coerce
         .number({ message: 'Department is required' })
         .int()
         .positive(),
      badgeNumber: badgeNumberField,
   }),
});

export const checkOutVisitorSchema = z.object({
   body: z.object({
      badgeNumber: badgeNumberField,
      notes: z.string().trim().optional(),
   }),
});

export const checkOutVisitByIdSchema = z.object({
   params: z.object({
      id: z.coerce.number().int().positive(),
   }),
});

export const cancelVisitParamsSchema = z.object({
   params: z.object({
      id: z.coerce.number().int().positive(),
   }),
});

export const visitIdParamSchema = z.object({
   params: z.object({
      id: z.coerce.number().int().positive(),
   }),
});

export const badgeParamSchema = z.object({
   params: z.object({
      badgeNumber: z.coerce.number().int().min(1).max(999),
   }),
});

export const visitsQuerySchema = z.object({
   query: z.object({
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().positive().max(100).default(20),
      search: z.string().trim().optional(),
      status: z
         .enum(['active', 'overstay', 'completed', 'cancelled', 'all'])
         .optional(),
      dateFilter: z
         .enum(['all', 'today', 'yesterday', 'last7days', 'last30days'])
         .optional(),
      departmentId: z.coerce.number().int().positive().optional(),
   }),
});

export type VisitsQuery = z.infer<typeof visitsQuerySchema>['query'];

export type VisitIdParams = z.infer<typeof visitIdParamSchema>['params'];

export type BadgeParams = z.infer<typeof badgeParamSchema>['params'];
