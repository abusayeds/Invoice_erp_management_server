import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { paymentReceivedController } from './paymentReceived.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  paymentReceivedController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  paymentReceivedController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  paymentReceivedController.getAll
);

export const paymentReceivedRoutes = router;
