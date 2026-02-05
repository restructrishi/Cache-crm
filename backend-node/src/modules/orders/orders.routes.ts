import * as express from 'express';
import { OrdersController } from './orders.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = express.Router();

router.use(express.json());
router.use(authenticateJWT);

router.post('/', OrdersController.create);
router.get('/', OrdersController.findAll);
router.get('/:id', OrdersController.findOne);
router.patch('/:id/step/:stepName', OrdersController.updateStep);
router.post('/:id/upload', OrdersController.uploadDocument);

export default router;
