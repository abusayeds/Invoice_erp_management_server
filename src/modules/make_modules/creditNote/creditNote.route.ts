import express from 'express';
import { authMiddleware } from '../../../middlewares/auth';
import { role } from '../../../utils/role';
import { creditNoteController } from './creditNote.controller';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(role.company),
  creditNoteController.create
);

router.get(
  '/single/:id',
  authMiddleware(role.company),
  creditNoteController.getSingle
);

router.get(
  '/all',
  authMiddleware(role.company),
  creditNoteController.getAll
);

export const creditNoteRoutes = router;
