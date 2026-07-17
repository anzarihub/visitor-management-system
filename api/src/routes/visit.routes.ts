import { Router } from 'express';
import {
   getVisits,
   getVisitById,
   getActiveVisitByBadge,
   getActiveVisitorsCount,
   checkInVisitor,
   checkOutVisitor,
   cancelVisit,
   checkOutVisitById,
} from '../controllers/visit.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { validate } from '../middlewares/validate.js';
import {
   checkInVisitorSchema,
   checkOutVisitorSchema,
   cancelVisitParamsSchema,
   visitIdParamSchema,
   badgeParamSchema,
   visitsQuerySchema,
   checkOutVisitByIdSchema,
} from '../validations/visit.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate(visitsQuerySchema), getVisits);
router.get('/active-count', getActiveVisitorsCount);
router.get(
   '/active/:badgeNumber',
   validate(badgeParamSchema),
   getActiveVisitByBadge,
);

router.post('/check-in', validate(checkInVisitorSchema), checkInVisitor);
router.patch(
   '/:id/checkout',
   validate(checkOutVisitByIdSchema),
   checkOutVisitById,
);
router.post('/check-out', validate(checkOutVisitorSchema), checkOutVisitor);

router.get('/:id', validate(visitIdParamSchema), getVisitById);
router.patch('/:id/cancel', validate(cancelVisitParamsSchema), cancelVisit);

export default router;
