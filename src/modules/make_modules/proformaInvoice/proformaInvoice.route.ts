import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { proformaInvoiceController } from './proformaInvoice.controller';

const router = express.Router();
router.post(
  '/create',
  authMiddleware(role.company),
  proformaInvoiceController.create
);
router.get(
  '/single/:id',
  authMiddleware(role.company),
  proformaInvoiceController.getSingle
);
router.get(
  '/all',
  authMiddleware(role.company),
  proformaInvoiceController.getAll
);

export const proformaInvoiceRoutes = router;
