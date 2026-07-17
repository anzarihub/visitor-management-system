import { z } from 'zod';
import { isValidEthiopianPhone } from '../phone';
import { ID_TYPE_OPTIONS } from '@/constants/visit';
import { IdTypeValue } from '@/types/visit.types';

export const visitorInfoSchema = z.object({
   fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name must be 100 characters or fewer'),
   phone: z
      .string()
      .optional()
      .refine(
         (val) => {
            if (!val || val === '+251 ') return true;

            return isValidEthiopianPhone(val);
         },
         { message: 'Enter a valid Ethiopian phone number' },
      ),
   idType: z.enum(
      ID_TYPE_OPTIONS.map((o) => o.value) as [IdTypeValue, ...IdTypeValue[]],
      { message: 'ID type is required' },
   ),
   idNumber: z
      .string()
      .min(1, 'ID number is required')
      .max(50, 'ID number must be 50 characters or fewer'),
   host: z
      .string()
      .min(1, 'Host name is required')
      .max(100, 'Host name must be 100 characters or fewer'),
   departmentId: z.coerce.number().min(1, 'Department is required').optional(),
});

export const badgeAssignmentSchema = z.object({
   badgeNumber: z
      .string()
      .length(3, 'Badge number must be exactly 3 digits')
      .regex(/^\d{3}$/, 'Badge number must contain only digits'),
});

// Full schema — merge of both steps
export const checkInSchema = visitorInfoSchema.extend(
   badgeAssignmentSchema.shape,
);

export type VisitorInfoValues = z.output<typeof visitorInfoSchema>;
export type BadgeAssignmentValues = z.output<typeof badgeAssignmentSchema>;
export type CheckInFormInput = z.input<typeof checkInSchema>;
export type CheckInFormValues = z.output<typeof checkInSchema>;
