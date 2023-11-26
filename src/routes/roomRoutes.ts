import { gameJoinRoomSchema } from '../middlewares/validateBody/schemas/gameJoinRoomSchema';
import { gameRoomSchema } from '../middlewares/validateBody/schemas/gameRoomSchema';
import { validateReqBody } from '../middlewares/validateBody';
import roomController from '../controllers/roomController';
import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/', validateReqBody(gameRoomSchema), roomController.create);
router.get('/:id', roomController.get);
router.get('/', roomController.getAll);

router.patch('/', validateReqBody(gameJoinRoomSchema), roomController.join);

export default router;
