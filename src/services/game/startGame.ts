import { Socket, Server } from 'socket.io';
import { rooms } from '../../repositories/inMemory/rooms';
import { sendNewWordTo } from '../../helpers/sendNewWordTo';
import { finishGame } from '../../helpers/finishGame';
import { IRoomId } from '../../interfaces/GameInterfaces';
import { clearInterval } from 'timers';
import { EventEmitter } from 'events';
import { CustomError } from '../../helpers/CustomError';
import { socketErrorHandler } from '../../middlewares/errorHandlers/socketErrorHandler';
export let eventEmitter: EventEmitter;

export const startGame = (socket: Socket, io: Server) => {
  return (body: IRoomId) => {

    try {
      const gameState = rooms.get(body.roomId);
      
      if (gameState) {  

        // check if each team has at lease 2 players
        if (gameState.teamAPlayers.size < 2 || gameState.teamBPlayers.size < 2) {
          throw new CustomError('Not enough players', 400); 
        }

        // Logic for changing turns
        const turnChangerLogic = () => {
          
          // check if game has already reached set amount of rounds or if either team has less than 2 players
          if ((gameState.finishedTurns / 2 >= gameState.roundsToPlay) || (gameState.teamAPlayers.size < 2 || gameState.teamBPlayers.size < 2)) {
            clearInterval(turnChanger);
            finishGame(gameState);
            io.to(body.roomId).emit('finish-game-results', {
              pointsTeamA: gameState.teamAPoints,
              pointsTeamB: gameState.teamBPoints,
            });

          } else {

            gameState.stealWord = false;
            gameState.wordGuessed = false;

            gameState.currentTeam === 'teamAPlayers'
              ? (gameState.currentTeam = 'teamBPlayers')
              : (gameState.currentTeam = 'teamAPlayers');

            gameState.finishedTurns++;
            // Send a message that turn has been changed
            socket
              .to(body.roomId)
              .emit('plays-team', `It's ${gameState.currentTeam}'s turn on room ${body.roomId}`);

            // Call logic for sending the word
            sendNewWordTo(gameState, socket, io);
          }
        };

        // Logic for word stealing (Opposite team can try to guess last word if it wasn't guessed yet)
        const stealWord = () => {
          if (!gameState.wordGuessed) {

            // pauses turn change
            clearInterval(turnChanger);
            gameState.stealWord = true;
            // lets other team know that they can guess the word
            io.to(body.roomId).emit('steal-word', `${gameState.currentTeam === 'teamAPlayers' ? 'teamBPlayers' : 'teamAPlayers'} has a chance to guess the word!`);
            
            const stealTimer = setTimeout(() => {
              turnChangerLogic();
              turnChanger = setInterval(
                stealWord, 
                gameState.roundTime * 1000
              );
              clearInterval(endSteal);
            }, 5000) // gives the other team 30 seconds

            // Interval for checking if the word was guessed and the "steal" phase should end
            const endSteal = setInterval(() => {
              if ((gameState.stealWord && gameState.wordGuessed) || !gameState.stealWord) {

                clearTimeout(stealTimer);
                turnChangerLogic();

                turnChanger = setInterval(
                  stealWord, 
                  gameState.roundTime * 1000
                );

                clearInterval(endSteal);
              
              }
            }, 1000);

          } else { // if word was guessed, there is no steal phase
            turnChangerLogic();
          }
        }

        // Calls the logic the first time, so we not wait for the first
        // set interval to happen
        turnChangerLogic();

        // Add function to call the logic every x amount of time
        let turnChanger = setInterval(
          stealWord, 
          gameState.roundTime * 1000
        );
        
        // set a timeout to finish the game 
        setTimeout(() => {
          clearInterval(turnChanger);
          io.to(body.roomId).emit('finish-game-results', {
            pointsTeamA: gameState.teamAPoints,
            pointsTeamB: gameState.teamBPoints,
          });
          finishGame(gameState);
        }, gameState.roundTime * gameState.roundsToPlay * 2 * 1000);
      }
    } catch (err) {
      socketErrorHandler(socket, err as CustomError);
    }
  }
};
