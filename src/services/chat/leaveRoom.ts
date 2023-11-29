import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { ROOM_SUFFIX } from './constants';
import { Socket } from 'socket.io';

export const leaveRoom = (socket: Socket) => {
  return () => {
    const userInfo = onlineUsers.get(socket.id);
    if (userInfo) {
      socket.leave(userInfo.roomId + ROOM_SUFFIX);
      socket
        .to(userInfo.roomId + ROOM_SUFFIX)
        .emit('message', `${userInfo.username} has left the chat room.`);
    }
  };
};
