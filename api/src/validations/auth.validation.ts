import { z } from 'zod';

export const loginSchema = z.object({
   body: z.object({
      username: z.string().trim().min(3).max(50),
      password: z.string().min(8).max(72),
   }),
});

export const updateProfileSchema = z.object({
   body: z.object({
      username: z.string().trim().min(3).max(50),
      phone: z.string().trim().min(7).max(20).optional(),
   }),
});

export const changePasswordSchema = z.object({
   body: z.object({
      currentPassword: z.string().min(8).max(72),
      newPassword: z.string().min(8).max(72),
   }),
});

export const forceChangePasswordSchema = z.object({
   body: z.object({
      newPassword: z.string().min(8).max(72),
   }),
});

export const checkUsernameSchema = z.object({
   query: z.object({
      username: z.string().trim().min(3).max(50),
   }),
});
