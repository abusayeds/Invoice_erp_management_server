import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { invoiceController } from './invoice.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  invoiceController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  invoiceController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  invoiceController.getAll
);

router.post(
  '/edit/:id',
  authMiddleware(role.company),
  invoiceController.update
);

router.delete(
  '/delete/:id',
  authMiddleware(role.company),
  invoiceController.remove
);

export const invoiceRoutes = router;
