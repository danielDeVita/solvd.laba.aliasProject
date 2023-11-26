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

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/room', roomRouter);
app.use("/", indexRouter);
app.use("/chat", chatRouter);

chatSetup(
  new Server(
    app.listen(process.env.CHAT_PORT, () => {
      console.log(`Chat server is running on http://localhost:${process.env.CHAT_PORT}`);
    })
  )
);

app.use("/user", userRouter);
app.use("/room", authenticateToken, roomRouter);

app.use(expressErrorHandler);

const server = http.createServer(app);

const io = new Server(server);

chatSetup(io);
gameSetup(io);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
