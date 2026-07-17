import { Router } from 'express';
import {
   login,
   logout,
   getCurrentUser,
   updateProfile,
   changePassword,
   forceChangePassword,
   checkUsername,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { validate } from '../middlewares/validate.js';
import {
   changePasswordSchema,
   checkUsernameSchema,
   forceChangePasswordSchema,
   loginSchema,
   updateProfileSchema,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getCurrentUser);
router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfile);

router.post(
   '/change-password',
   requireAuth,
   validate(changePasswordSchema),
   changePassword,
);

router.post(
   '/force-change-password',
   requireAuth,
   validate(forceChangePasswordSchema),
   forceChangePassword,
);

router.get(
   '/check-username',
   requireAuth,
   validate(checkUsernameSchema),
   checkUsername,
);

export default router;
