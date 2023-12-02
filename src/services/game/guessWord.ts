import { Socket } from 'socket.io';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { rooms } from '../../repositories/inMemory/rooms';
import { sendNewWordTo } from '../../helpers/sendNewWordTo';
import { IWord } from '../../interfaces/GameInterfaces';
import { Server } from 'socket.io';
import { CustomError } from '../../helpers/CustomError';
import { socketErrorHandler } from '../../middlewares/errorHandlers/socketErrorHandler';

/**
 * Logic for guessing the word. 
 * @param socket
 * @returns
 */
export const guessWord = (socket: Socket, io: Server) => {

  return (body: IWord) => {

    try {

      const userInfo = onlineUsers.get(socket.id);

      if (userInfo) {
        
        const gameState = rooms.get(userInfo.roomId);
      
        if (gameState) {

          //check if team member that guessed is allowed to do so
          
          if (
            (!gameState[gameState.currentTeam].has(socket.id) && !gameState.stealWord) || 
            (gameState[gameState.currentTeam].has(socket.id) && gameState.stealWord)
          ) {
            throw new CustomError(`${userInfo.username} can't guess, he's not a member of the team`, 400);
          }

          // check if guesser is not the player giving hints
          if (socket.id === gameState.currentPlayer)
            throw new CustomError(`${userInfo.username} can't guess, he's the one giving hints`, 400);

          // if the word is guessed
          if (body.word === gameState.currentWord) {
            gameState.wordGuessed = true;
            gameState.wordsHistory.push(gameState.currentWord);
            
            // if we are in a steal word phase we have to add points to the other team
            if (gameState.stealWord){
              gameState.currentTeam === 'teamAPlayers' 
                ? gameState.teamBPoints++
                : gameState.teamAPoints++;
            } else {
              gameState.currentTeam === 'teamAPlayers' 
                ? gameState.teamAPoints++
                : gameState.teamBPoints++;
            }
            // let everyone know word was guessed
            io
            .to(userInfo.roomId)
            .emit('correct-guess', `${userInfo.username} guessed ${gameState.currentWord} correctly!`);
            sendNewWordTo(gameState, socket, io, true);

          } else {
            // if word wasn't guessed let everyone know
            io
            .to(userInfo.roomId)
            .emit('incorrect-guess', `${userInfo.username} guessed ${body.word} which was incorrect`);
          }
        } 
      }
    } catch (err) {
      socketErrorHandler(socket, (err as CustomError));
    }
  };
};
