import { z } from 'zod';
import { isValidEthiopianPhone } from '../phone';

export const profileSchema = z.object({
   username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be 30 characters or fewer')
      .regex(
         /^[a-zA-Z0-9_]+$/,
         'Username may only contain letters, numbers, and underscores',
      ),
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
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
   .string()
   .min(8, 'Password must be at least 8 characters')
   .max(72, 'Password must be 72 characters or fewer')
   .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
   .regex(/[0-9]/, 'Password must contain at least one number');

export const changePasswordSchema = z
   .object({
      currentPassword: z.string().min(1, 'Current password is required'),

      newPassword: passwordSchema,

      confirmPassword: z.string().min(1, 'Please confirm your new password'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
   })
   .refine((data) => data.newPassword !== data.currentPassword, {
      path: ['newPassword'],
      message: 'New password must be different from your current password',
   });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
