import { Router } from 'express';
import {
   getVisitStats,
   getVisitGrowth,
   getDepartmentVisits,
} from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { validate } from '../middlewares/validate.js';
import {
   dashboardStatsSchema,
   visitGrowthSchema,
   departmentVisitsSchema,
} from '../validations/dashboard.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/stats', validate(dashboardStatsSchema), getVisitStats);
router.get('/visit-growth', validate(visitGrowthSchema), getVisitGrowth);
router.get(
   '/department-visits',
   validate(departmentVisitsSchema),
   getDepartmentVisits,
);

export default router;
