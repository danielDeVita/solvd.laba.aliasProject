import { Server, Socket } from 'socket.io';
import { IChatMessage } from '../interfaces/IChatMessage';

export const chatSetup = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('a user connected', socket.id, socket.handshake.auth.token);
    // join to the room
    socket.on("joinRoom", (room: string) => {
      socket.join(room);
      socket.to(room).emit("message", 'socket.id: ' + socket.id);
    });

    // leave from the room
    socket.on("leaveRoom", (room: string) => {
      socket.leave(room);
    });

    socket.on("game handler", ({word}: {word: string}, room: string) => {
      io.to(room).emit('game party', word);
    })

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