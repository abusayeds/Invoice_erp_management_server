import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { billController } from './bill.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  billController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  billController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  billController.getAll
);

export const billRoutes = router;
