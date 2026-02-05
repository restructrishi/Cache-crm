import express, { Router } from 'express';
import { DeploymentController } from './deployment.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

// Ensure body parsing
router.use(express.json());

// Apply auth middleware to all routes
router.use(authenticateJWT);

// Deployment Routes
router.post('/', DeploymentController.create);
router.get('/', DeploymentController.findAll);
router.get('/:id', DeploymentController.findOne);
router.put('/:id', DeploymentController.update);

// Task Routes (Nested)
router.post('/:id/tasks', DeploymentController.addTask);
router.put('/tasks/:taskId', DeploymentController.updateTask);
router.delete('/tasks/:taskId', DeploymentController.removeTask);

export default router;
