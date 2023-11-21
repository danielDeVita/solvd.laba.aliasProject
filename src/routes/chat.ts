import {Router} from 'express';

const router = Router();

//get all rooms
router.get("/", (req, res) => {
  return res.json(['rooms']);
})

//create new room 
router.post("/", (req, res) => {
  return res.json('new room');
});

export default router;