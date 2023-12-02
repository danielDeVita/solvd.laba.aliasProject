import { Server, Socket } from 'socket.io';
import { playerReady } from '../../services/game/playerReady';
import { disconnect } from '../../services/game/disconnect';
import { startGame as startGame } from '../../services/game/startGame';
import { guessWord } from '../../services/game/guessWord';
import { sendHint } from '../../services/game/sendHint';

export const gameSetup = (io: Server) => {
	io.on('connection', (socket: Socket) => {

		// Joining a room
		socket.on('ready', playerReady(socket));
				
		// Disconnecting form a room
		socket.on('disconnect', disconnect(socket));

		// Starting a room game
		socket.on('start-room-game', startGame(socket, io));

		// Guess word
		socket.on('guess-word', guessWord(socket, io));

		// Send a hint
		socket.on('send-hint', sendHint(socket, io));

	});
};