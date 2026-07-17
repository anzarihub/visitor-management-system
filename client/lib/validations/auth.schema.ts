import { z } from 'zod';
import { passwordSchema } from './profile.schema';

export const loginSchema = z.object({
   username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be 50 characters or fewer'),

   password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forceChangePasswordSchema = z
   .object({
      newPassword: passwordSchema,

      confirmPassword: z.string().min(1, 'Please confirm your new password'),
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
   });

export type ForceChangePasswordFormValues = z.infer<
   typeof forceChangePasswordSchema
>;
