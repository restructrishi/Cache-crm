import * as express from 'express';
import { Router } from 'express';
import { PipelineController } from './pipeline.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

// Ensure body parsing is enabled for this router
router.use(express.json());

// Apply authentication to all routes
router.use(authenticateJWT);

// Create pipeline (e.g. after Deal WON)
router.post('/', PipelineController.create);

// List all pipelines for organization
router.get('/', PipelineController.findAll);

// Get single pipeline by ID
router.get('/:id', PipelineController.findOne);

// Update a specific step (Role validation handled in service)
router.patch('/:id/step/:stepName', PipelineController.updateStep);

export default router;
