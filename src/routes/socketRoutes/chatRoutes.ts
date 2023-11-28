import { sendMessage } from '../../services/chat/sendMessage';
import { disconnect } from '../../services/chat/disconnect';
import { leaveRoom } from '../../services/chat/leaveRoom';
import { joinRoom } from '../../services/chat/joinRoom';
import { Server, Socket } from 'socket.io';

export const chatSetup = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    // Join chat room
    socket.on('joinRoom', joinRoom(socket));

    // Leave chat room
    socket.on('leaveRoom', leaveRoom(socket));

    // Send a message
    socket.on('message', sendMessage(socket, io));

    // Disconnects
    socket.on('disconnect', disconnect(socket));
  });
};
