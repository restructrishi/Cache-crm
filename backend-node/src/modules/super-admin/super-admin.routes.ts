import express, { Router } from 'express';
import { SuperAdminController } from './super-admin.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.guard';

const router = Router();

// Ensure body parsing
router.use(express.json());

// Secure all routes
router.use(authenticateJWT);
router.use(requireRole(['SUPER_ADMIN']));

router.post('/organizations', SuperAdminController.createOrganization);
router.post('/org-admin', SuperAdminController.createOrgAdmin);
router.get('/organizations', SuperAdminController.getAllOrganizations);

export default router;
