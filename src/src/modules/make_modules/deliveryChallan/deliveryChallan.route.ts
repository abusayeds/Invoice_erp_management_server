import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { deliveryChallanController } from './deliveryChallan.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  deliveryChallanController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  deliveryChallanController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  deliveryChallanController.getAll
);

router.post(
  '/edit/:id',
  authMiddleware(role.company),
  deliveryChallanController.update
);

router.delete(
  '/delete/:id',
  authMiddleware(role.company),
  deliveryChallanController.remove
);

export const deliveryChallanRoutes = router;
