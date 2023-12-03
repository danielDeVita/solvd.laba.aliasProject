import { Server, Socket } from 'socket.io';
import { GameState } from '../interfaces/GameInterfaces';
import { getUniqueWord } from './getUniqueWord';
import { onlineUsers } from '../repositories/inMemory/onlineUsers';


export const sendNewWordTo = (
  gameState: GameState,
  socket: Socket,
  io: Server,
  keepPlayer: boolean = false
) => {
  if (!(gameState.stealWord && gameState.wordGuessed)){

    // Get socket IDs of team that is playing
    const playingTeamPlayers: string[]= [...gameState[gameState.currentTeam]];

    gameState.currentPlayer = playingTeamPlayers[0]; // players socket id
    
    // If a player guesses the word, we do not change
    // players and give him another word
    if (keepPlayer)
      gameState.currentPlayer = playingTeamPlayers[playingTeamPlayers.length - 1];

    // Rotating players so all can play, current player goes to
    // the last position
    if (!keepPlayer) {
      gameState[gameState.currentTeam].delete(gameState.currentPlayer);
      gameState[gameState.currentTeam].add(gameState.currentPlayer);
    }

    const userInfo = onlineUsers.get(gameState.currentPlayer);
    if (userInfo) {
      io.to(gameState._id).emit(
        'new-word-sent-to',
        `New word sent to ${userInfo.username} from team ${gameState.currentTeam}` 
      );
      
      gameState.currentWord = getUniqueWord(gameState.wordsHistory);
      gameState.wordGuessed = false;
      gameState.hinted = false;
      if (socket.id === gameState.currentPlayer)
        socket.emit('new-word', gameState.currentWord);
      else
        socket.to(gameState.currentPlayer).emit('new-word', gameState.currentWord);
    }
  }
};
