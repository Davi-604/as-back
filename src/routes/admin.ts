import { Router } from 'express';
import * as authController from '../controllers/auth';
import * as eventController from '../controllers/event';
import * as groupController from '../controllers/group';
import * as peopleController from '../controllers/people';

const router = Router();

router.post('/login', authController.login);

router.get('/ping', authController.validate, (req, res) =>
    res.json({ pong: true, admin: true })
);

router.get('/events', authController.validate, eventController.getAll);
router.get('/events/:id', authController.validate, eventController.getOne);
router.post('/events', authController.validate, eventController.add);
router.put('/events/:id', authController.validate, eventController.update);
router.delete('/events/:id', authController.validate, eventController.remove);

router.get('/events/:id_event/groups', authController.validate, groupController.getAll);
router.get(
    '/events/:id_event/groups/:id',
    authController.validate,
    groupController.getOne
);
router.post('/events/:id_event/groups', authController.validate, groupController.add);
router.put(
    '/events/:id_event/groups/:id',
    authController.validate,
    groupController.update
);
router.delete(
    '/events/:id_event/groups/:id',
    authController.validate,
    groupController.remove
);

router.get(
    '/events/:id_event/groups/:id_group/people',
    authController.validate,
    peopleController.getAll
);
router.get(
    '/events/:id_event/groups/:id_group/people/:id',
    authController.validate,
    peopleController.getOne
);
router.post(
    '/events/:id_event/groups/:id_group/people',
    authController.validate,
    peopleController.add
);
router.delete(
    '/events/:id_event/groups/:id_group/people/:id',
    authController.validate,
    peopleController.remove
);

export default router;
