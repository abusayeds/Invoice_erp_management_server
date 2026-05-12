import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { purchaseOrderController } from './purchaseOrder.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  purchaseOrderController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  purchaseOrderController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  purchaseOrderController.getAll
);

export const purchaseOrderRoutes = router;
