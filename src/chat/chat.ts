import {Server, Socket} from 'socket.io';

export const chatSetup = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message', (msg: string) => {
      io.emit('message', msg);
    })
  })
}