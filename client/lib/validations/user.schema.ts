import { z } from 'zod';
import { USER_ROLES } from '@/constants/user';
import { isValidEthiopianPhone } from '../phone';

const firstNameSchema = z
   .string()
   .min(1, 'First name is required')
   .max(50, 'First name must be 50 characters or fewer');

const lastNameSchema = z
   .string()
   .min(1, 'Last name is required')
   .max(50, 'Last name must be 50 characters or fewer');

const usernameSchema = z
   .string()
   .min(3, 'Username must be at least 3 characters')
   .max(30, 'Username must be 30 characters or fewer')
   .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username may only contain letters, numbers, and underscores',
   );

const phoneSchema = z
   .string()
   .optional()
   .refine(
      (value) => {
         if (!value || value === '+251 ') return true;
         return isValidEthiopianPhone(value);
      },
      {
         message: 'Enter a valid Ethiopian phone number',
      },
   );

const passwordSchema = z
   .string()
   .min(8, 'Password must be at least 8 characters')
   .max(72, 'Password must be 72 characters or fewer');

export const createUserSchema = z.object({
   firstName: firstNameSchema,

   lastName: lastNameSchema,

   username: usernameSchema,

   phone: phoneSchema,

   role: z.enum(USER_ROLES, {
      message: 'Role is required',
   }),

   password: passwordSchema,
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
