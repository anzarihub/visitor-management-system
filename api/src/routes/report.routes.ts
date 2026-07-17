import { Router } from 'express';
import {
   exportVisitLog,
   getReportStats,
} from '../controllers/report.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/require-role.js';
import { validate } from '../middlewares/validate.js';
import { exportVisitLogSchema } from '../validations/report.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/stats', getReportStats);
router.get(
   '/export',
   requireRole('admin'),
   validate(exportVisitLogSchema),
   exportVisitLog,
);

export default router;
