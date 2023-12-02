import { GameState } from '../interfaces/GameInterfaces';
import { onlineUsers } from '../repositories/inMemory/onlineUsers';
import { rooms } from '../repositories/inMemory/rooms';
import  RoomService from '../services/roomService';
export const finishGame = (gameState: GameState) => {
    
    RoomService.updateEndGameRoomState(gameState._id, {teamAPoints: gameState.teamAPoints, teamBPoints: gameState.teamBPoints});

    rooms.delete(gameState._id);
    for (const id in gameState.teamAPlayers){
        onlineUsers.delete(id);
    }
    for (const id in gameState.teamBPlayers){
        onlineUsers.delete(id);
    }
};