import express from 'express';
import indexRouter from './routes/index';
import chatRouter from './routes/chat';
import { Server } from 'socket.io';
import http from 'http';
import { chatSetup } from './chat/chat';
import userRouter from './routes/userRoutes';
import roomRouter from './routes/roomRoutes';
import { expressErrorHandler } from './middlewares/errorHandlers/expressErrorHandler';
import { authenticateToken } from './middlewares/auth/authMiddleware';
import { gameSetup } from './routes/socketRoutes/gameRoutes';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/room', authenticateToken, roomRouter);
app.use('/', indexRouter);
app.use('/chat', chatRouter);

const PORT = Number(process.env.PORT) || 3000;

app.use('/user', userRouter);
app.use('/room', authenticateToken, roomRouter);

app.use(expressErrorHandler);

export const server = http.createServer(app);

const io = new Server(server);

chatSetup(io);
gameSetup(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
