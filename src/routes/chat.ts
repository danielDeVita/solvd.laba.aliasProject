import {Router} from 'express';
import path from 'path';
import chatMessageController from '../controllers/chatMessageController';
import { validateReqBody } from '../middlewares/validateBody';
import { chatMessageSchema } from '../middlewares/validateBody/schemas/chatSchema';

const router = Router();

router.get("/messages/", chatMessageController.getAll);
router.get("/:room/messages/", chatMessageController.getByRoomId);

//get all rooms
router.get("/", (req, res) => {
  // return res.json(['rooms']);
  const viewPath = path.join(__dirname, '../views/chat/all-rooms.html');
  
  return res.sendFile( viewPath);  
})

router.get("/:room", (req, res) => {
  const viewPath = path.join(__dirname, `../views/chat/room.html`)
  
  return res.sendFile(viewPath);
})

//create new room 
router.post("/", (req, res) => {
  return res.json('new room');
});

export default router;