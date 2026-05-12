import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { salesReceiptController } from './salesReceipt.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  salesReceiptController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  salesReceiptController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  salesReceiptController.getAll
);

export const salesReceiptRoutes = router;
