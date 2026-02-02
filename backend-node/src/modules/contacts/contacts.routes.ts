import express, { Router } from 'express';
import { ContactsController } from './contacts.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(express.json());
router.use(authenticateJWT);

router.post('/', ContactsController.create);
router.get('/', ContactsController.findAll);
router.get('/:id', ContactsController.findOne);
router.put('/:id', ContactsController.update);
router.delete('/:id', ContactsController.remove);

export default router;
