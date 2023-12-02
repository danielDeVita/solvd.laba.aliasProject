import { Request, Response, Router } from 'express';
import { authenticateToken } from '../middlewares/auth/authMiddleware';

const router = Router();

router.get('/', authenticateToken, (req: Request, res: Response) => {
  return res.send('endpoint ok');
});

export default router;
