import { Server, Socket } from 'socket.io';
import { IChatMessage } from '../interfaces/IChatMessage';

const mockedRoom = 'room';
export const chatSetup = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected');
    // join to the room
    socket.on("joinRoom", (room: string) => {
      socket.join(mockedRoom);
      socket.to(mockedRoom).emit("message", 'socket.id: ' + socket.id);
      console.log(`Client joined room: ${mockedRoom}`);
    });

    // leave from the room
    socket.on("leaveRoom", (room: string) => {
      socket.leave(mockedRoom);
      console.log(`Client left room: ${mockedRoom}`);
    });

    // user sends a message
    socket.on("message", ({message}: IChatMessage) => {
      console.log(`Client sent message: ${message} `);
      io.to(mockedRoom).emit("message", message);
    });

    // user disconnects
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  })
}