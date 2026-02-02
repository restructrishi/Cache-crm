import { Router } from 'express';
import { CustomerPoController } from './customer-po.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', CustomerPoController.findAll);
router.get('/:id', CustomerPoController.findOne);

export default router;
