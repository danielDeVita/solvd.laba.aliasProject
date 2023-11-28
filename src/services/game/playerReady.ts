import { Socket } from 'socket.io';
import { rooms } from '../../repositories/inMemory/rooms';
import { GameRoomDto } from '../../dtos/GameRoomDto';
import roomService from '../roomService';
import { CustomError } from '../../helpers/CustomError';
import { socketErrorHandler } from '../../middlewares/errorHandlers/socketErrorHandler';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';

/**
 * Join a user to a game Room
 * @param socket
 * @returns
 */
export const playerReady = (socket: Socket) => {
  return async () => {
    try {
      const userInfo = onlineUsers.get(socket.id);
      if(!userInfo) return;

      // Add user to the room.
      socket.join(userInfo.roomId);
      const roomInfo: GameRoomDto = await roomService.get(userInfo.roomId);

      // if the room map does not have the room, we create it.
      if (!rooms.has(userInfo.roomId)) {
        rooms.set(userInfo.roomId, {
          teamNumberOfPlayers: roomInfo.teamNumberOfPlayers,
          roundTime: roomInfo.roundTime,
          roundsToPlay: roomInfo.roundsToPlay,
          _id: roomInfo._id,
          createdBy: roomInfo.createdBy,
          createdAt: roomInfo.createdAt,
          updatedAt: roomInfo.updatedAt,
          teamAPlayers: new Set(), // has socket ids
          teamBPlayers: new Set(),
          teamAPoints: roomInfo.teamAPoints,
          teamBPoints: roomInfo.teamBPoints,
          wordGuessed: false,
          stealWord: false,
          currentWord: '',
          currentTeam: 'teamAPlayers',
          wordsHistory: [],
          currentPlayer: '',
          finishedTurns: 0,
        });
      }
      // getting the room where user want to join
      const gameState = rooms.get(userInfo.roomId);
      if (gameState) {
        // adding user
        if (roomInfo.teamAPlayers.includes(userInfo.username))
          gameState['teamAPlayers'].add(socket.id);
        else if (roomInfo.teamBPlayers.includes(userInfo.username))
          gameState['teamBPlayers'].add(socket.id);
        else {
          throw new CustomError('Must belong to a team', 400);
        }

        // updating the room with the new joined user
        rooms.set(userInfo.roomId, gameState);
      }

      // Sending message to everyone that this user joined
      socket
        .to(userInfo.roomId)
        .emit('new-room-join', `${userInfo.username} has joined the room.`);
    } catch (err) {
      socketErrorHandler(socket, err as CustomError);
    }
  };
};
