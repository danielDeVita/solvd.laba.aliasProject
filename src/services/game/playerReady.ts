import { Socket } from 'socket.io';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { rooms } from '../../repositories/inMemory/rooms';
import { IPlayerReadyInfo } from '../../interfaces/GameInterfaces';
import { GameRoomDto } from '../../dtos/GameRoomDto';
import roomService from '../roomService';
import { CustomError } from '../../helpers/CustomError';
import { socketErrorHandler } from '../../middlewares/errorHandlers/socketErrorHandler';

/**
 * Join a user to a game Room
 * @param socket 
 * @returns 
 */
export const playerReady = (socket: Socket) => {
  return async (body: IPlayerReadyInfo) => {
    try {

      // Add user to the room. 
      socket.join(body.roomId);
      const roomInfo: GameRoomDto = await roomService.get(body.roomId);
      
      // if the room map does not have the room, we create it.
      if (!rooms.has(body.roomId)){
        rooms.set(body.roomId, {
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
          finishedTurns: 0
        });
      }
      // getting the room where user want to join
      const gameState = rooms.get(body.roomId);
      if (gameState) {

        // adding user
        if (roomInfo.teamAPlayers.includes(body.username))
          gameState['teamAPlayers'].add(socket.id);
        else if (roomInfo.teamBPlayers.includes(body.username))
          gameState['teamBPlayers'].add(socket.id);
        else{
          throw new CustomError('Must belong to a team', 400);
        }
        
        // updating the room with the new joined user
        rooms.set(body.roomId, gameState);
      }

      // adding user to the onlineUsers, this onlineUsers allows us
      // to track the user information, just knowing his socket id.
      onlineUsers.set(socket.id, {
        username: body.username,
        roomId: body.roomId, 
      });

      // Sending message to everyone that this user joined
      socket
        .to(body.roomId)
        .emit('new-room-join', `${body.username} has joined the room.`);
    } catch (err) {
      socketErrorHandler(socket, err as CustomError);
    }
  };
};
