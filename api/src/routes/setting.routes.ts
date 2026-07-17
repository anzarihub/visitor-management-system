import { Router } from 'express';
import {
   getSettings,
   updateGeneralSettings,
} from '../controllers/setting.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { validate } from '../middlewares/validate.js';
import { updateGeneralSettingsSchema } from '../validations/setting.validation.js';

const router = Router();

router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', getSettings);
router.patch(
   '/general',
   validate(updateGeneralSettingsSchema),
   updateGeneralSettings,
);

export default router;
