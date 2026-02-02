import express, { Router } from 'express';
import { AdminUsersController } from './users.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.guard';

const router = Router();

// Ensure body parsing
router.use(express.json());

// Secure all routes
router.use(authenticateJWT);
router.use(requireRole(['ORG_ADMIN']));

router.post('/users', AdminUsersController.createUser);
router.get('/users', AdminUsersController.listUsers);
router.patch('/users/:id/status', AdminUsersController.updateUserStatus);

export default router;
