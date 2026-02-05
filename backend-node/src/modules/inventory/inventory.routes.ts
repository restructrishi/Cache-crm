import { Router } from 'express';
import { InventoryController } from './inventory.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', InventoryController.create);
router.get('/', InventoryController.findAll);
router.get('/:id', InventoryController.findOne);
router.put('/:id', InventoryController.update);
router.delete('/:id', InventoryController.delete);

export default router;
