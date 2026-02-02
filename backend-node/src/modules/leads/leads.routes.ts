import express, { Router } from 'express';
import { LeadsController } from './leads.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

// Ensure body parsing
router.use(express.json());

// Apply auth middleware to all routes
router.use(authenticateJWT);

router.post('/', LeadsController.create);
router.get('/', LeadsController.findAll);
router.get('/:id', LeadsController.findOne);
router.put('/:id', LeadsController.update);
router.delete('/:id', LeadsController.remove);

export default router;
