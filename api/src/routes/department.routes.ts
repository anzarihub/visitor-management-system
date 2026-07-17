import { Router } from 'express';
import {
   getDepartments,
   getDepartmentById,
   createDepartment,
   updateDepartment,
   updateDepartmentStatus,
   deleteDepartment,
} from '../controllers/department.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { validate } from '../middlewares/validate.js';
import {
   createDepartmentSchema,
   getDepartmentsSchema,
   updateDepartmentSchema,
   updateDepartmentStatusSchema,
} from '../validations/department.validation.js';
import { idParamSchema } from '../validations/shared.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(getDepartmentsSchema), getDepartments);
router.get('/:id', validate(idParamSchema), getDepartmentById);

router.post(
   '/',
   requireRole('admin'),
   validate(createDepartmentSchema),
   createDepartment,
);

router.patch(
   '/:id',
   requireRole('admin'),
   validate(updateDepartmentSchema),
   updateDepartment,
);

router.patch(
   '/:id/status',
   requireRole('admin'),
   validate(updateDepartmentStatusSchema),
   updateDepartmentStatus,
);

router.delete(
   '/:id',
   requireRole('admin'),
   validate(idParamSchema),
   deleteDepartment,
);

export default router;
