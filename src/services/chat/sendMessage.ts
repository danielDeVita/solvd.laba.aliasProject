import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import {
  IIncomingSocketMessage,
  IOutgoingSocketMessage,
} from '../../interfaces/IChatMessage';
import ChatMessageService from '../chatMessageService';
import { Server, Socket } from 'socket.io';
import { ROOM_SUFFIX } from './constants';
import { socketErrorHandler } from '../../middlewares/errorHandlers/socketErrorHandler';
import { CustomError } from '../../helpers/CustomError';

export const sendMessage = (socket: Socket, io: Server) => {
  return async (message: IIncomingSocketMessage) => {
    const userInfo = onlineUsers.get(socket.id);
    try {
      if (userInfo && socket.rooms.has(userInfo.roomId + ROOM_SUFFIX)) {
        const chatMessage: IOutgoingSocketMessage = {
          message: message.message,
          roomId: userInfo.roomId,
          createdBy: userInfo.username,
          createdAt: new Date().toISOString(),
        };

        await ChatMessageService.create(chatMessage);
        io.to(userInfo.roomId + ROOM_SUFFIX).emit('chat message', chatMessage);
      }
    } catch {
      socketErrorHandler(socket, new CustomError('Error sending message', 500));
    }
  };
};
