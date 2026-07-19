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

router.post(
  '/edit/:id',
  authMiddleware(role.company),
  salesReceiptController.update
);

router.delete(
  '/delete/:id',
  authMiddleware(role.company),
  salesReceiptController.remove
);

export const salesReceiptRoutes = router;
