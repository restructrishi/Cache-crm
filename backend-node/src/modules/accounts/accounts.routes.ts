import express, { Router } from 'express';
import { AccountsController } from './accounts.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

// Ensure body parsing
router.use(express.json());

// Apply auth middleware to all routes
router.use(authenticateJWT);

router.post('/', AccountsController.create);
router.get('/', AccountsController.findAll);
router.get('/:id', AccountsController.findOne);
router.put('/:id', AccountsController.update);
router.delete('/:id', AccountsController.remove);

export default router;
