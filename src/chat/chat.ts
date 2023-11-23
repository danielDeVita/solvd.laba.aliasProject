import { Server, Socket } from 'socket.io';
import { IChatMessage } from '../interfaces/IChatMessage';

const mockedRoom = 'room';
export const chatSetup = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    // join to the room
    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      socket.to(room).emit("message", 'socket.id: ' + socket.id);
      console.log(`Client joined room: ${room}`);
    });

    // leave from the room
    socket.on("leaveRoom", (room: string) => {
      socket.leave(room);
      console.log(`Client left room: ${room}`);
    });

    // user sends a message
    socket.on("message", ({message}: IChatMessage, room: string) => {
      io.to(room).emit('chat message', message);
    });

    // user disconnects
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  })
}