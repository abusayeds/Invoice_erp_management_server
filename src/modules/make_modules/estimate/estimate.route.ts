import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { estimateController } from './estimate.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  estimateController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  estimateController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  estimateController.getAll
);

export const estimateRoutes = router;
