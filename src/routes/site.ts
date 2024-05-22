import { Router } from 'express';
import * as eventController from '../controllers/event';
import * as peopleController from '../controllers/people';

const router = Router();

router.get('/events/:id', eventController.getOne);
router.get('/events/:id_event/search', peopleController.searchPerson);

export default router;
