import { Router } from 'express';
import { MeetingsController } from './meetings.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', MeetingsController.create);
router.get('/', MeetingsController.findAll);
router.get('/:id', MeetingsController.findOne);
router.put('/:id', MeetingsController.update);
router.delete('/:id', MeetingsController.remove);

// MOM Routes
router.post('/:id/mom', MeetingsController.createMom);

export default router;
