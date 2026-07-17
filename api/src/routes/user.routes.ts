import { Router } from 'express';
import {
   createUser,
   getUsers,
   getUserById,
   updateUser,
   changeUserRole,
   updateUserStatus,
   resetUserPassword,
   deleteUser,
} from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { validate } from '../middlewares/validate.js';
import {
   createUserSchema,
   updateUserSchema,
   changeUserRoleSchema,
   updateUserStatusSchema,
} from '../validations/user.validation.js';
import { idParamSchema } from '../validations/shared.validation.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', getUsers);
router.get('/:id', validate(idParamSchema), getUserById);
router.post('/', validate(createUserSchema), createUser);

// PUT to match usersService.update() (frontend uses api.put, not patch)
router.put('/:id', validate(updateUserSchema), updateUser);

router.patch('/:id/role', validate(changeUserRoleSchema), changeUserRole);
router.patch('/:id/status', validate(updateUserStatusSchema), updateUserStatus);
router.post('/:id/reset-password', validate(idParamSchema), resetUserPassword);
router.delete('/:id', validate(idParamSchema), deleteUser);

export default router;
