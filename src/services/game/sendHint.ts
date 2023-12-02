import { Server, Socket } from 'socket.io';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { rooms } from '../../repositories/inMemory/rooms';
import { IHint } from '../../interfaces/GameInterfaces';
import { WordChecker } from '../../utils/wordAlgorithm';
import { CustomError } from '../../helpers/CustomError';
import { socketErrorHandler } from '../../middlewares/errorHandlers/socketErrorHandler';

/**
 * Logic for sending hints
 * @param socket
 * @returns
 */
export const sendHint = (socket: Socket, io: Server) => {
  return (body: IHint) => {

    try {

      const userInfo = onlineUsers.get(socket.id);

      if (userInfo) {
        
        const gameState = rooms.get(userInfo.roomId);

        if (gameState) {

          //check if person sending hint is allowed to
          if (socket.id !== gameState.currentPlayer) {
            throw new CustomError(`${userInfo.username} can't send hints, it's not his turn`, 400);
          }
          
          // check if hint has the word or some deriative
          body.hint.split(' ').forEach(word => {
              const wordChecker: WordChecker = new WordChecker(gameState.currentWord, word);
              if (wordChecker.isSameWord() || !wordChecker.isWordValid()) {
                  throw new CustomError('Invalid hint', 400);
              }
          });
          // show everyone the hint
          gameState.hinted = true;
          io.to(userInfo.roomId).emit('show-hint', `${userInfo.username} hinted: ${body.hint}`);
        } 
      }
    } catch (err) {
      socketErrorHandler(socket, err as CustomError)
    }
  };
};
