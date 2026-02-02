import { Router } from 'express';
import express from 'express';
import { DealsController } from './deals.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(express.json());
router.use(authenticateJWT);

router.post('/', DealsController.create);
router.get('/', DealsController.findAll);
router.get('/:id', DealsController.findOne);
router.put('/:id', DealsController.update);
router.delete('/:id', DealsController.remove);

export default router;
