import { Socket } from 'socket.io';
import { playerReady } from '../../../services/game/playerReady';
import { rooms } from '../../../repositories/inMemory/rooms';
import { GameRoomDto } from '../../../dtos/GameRoomDto';
import roomService from '../../../services/roomService';
import { CustomError } from '../../../helpers/CustomError';
import { socketErrorHandler } from '../../../middlewares/errorHandlers/socketErrorHandler';
import { onlineUsers } from '../../../repositories/inMemory/onlineUsers';

// Mock dependencies
jest.mock('../../../repositories/inMemory/rooms');
jest.mock('../../../dtos/GameRoomDto');
jest.mock('../../../services/roomService');
jest.mock('../../../helpers/CustomError');
jest.mock('../../../middlewares/errorHandlers/socketErrorHandler', ()=>({
  socketErrorHandler: jest.fn(),
}));
jest.mock('../../../repositories/inMemory/onlineUsers');

describe('playerReady', () => {
  let socket: Socket;

  beforeEach(() => {
    socket = {
      id: 'socket-id',
      join: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    } as unknown as Socket;

    jest.clearAllMocks();
  });

  it('should join the user to the room and emit a "new-room-join" event', async () => {
    onlineUsers.get = jest.fn().mockReturnValue({ roomId: 'room-id', username: 'test-user' });

    roomService.get = jest.fn().mockResolvedValue({
        teamNumberOfPlayers: 2,
        roundTime: 60,
        roundsToPlay: 3,
        _id: 'room-id',
        createdBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
        teamAPlayers: ['player1', 'player2'],
        teamBPlayers: ['player3', 'player4'],
        teamAPoints: 0,
        teamBPoints: 0,
      } as unknown as GameRoomDto);

    rooms.has = jest.fn().mockReturnValue(false);

    rooms.set = jest.fn();

    const playerReadyFn = playerReady(socket);
    await playerReadyFn();

    expect(socket.join).toHaveBeenCalledWith('room-id');

    expect(rooms.set).toHaveBeenCalledWith('room-id', {
      teamNumberOfPlayers: 2,
      roundTime: 60,
      roundsToPlay: 3,
      _id: 'room-id',
      createdBy: 'test-user',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      teamAPlayers: new Set(),
      teamBPlayers: new Set(),
      teamAPoints: 0,
      teamBPoints: 0,
      wordGuessed: false,
      stealWord: false,
      currentWord: '',
      currentTeam: 'teamAPlayers',
      wordsHistory: [],
      currentPlayer: '',
      finishedTurns: 0,
      hinted: false,
    });

    expect(rooms.set).toHaveBeenCalledWith('room-id', expect.objectContaining({
      teamAPlayers: expect.any(Set),
      teamBPlayers: expect.any(Set),
    }));

    expect(socket.to).toHaveBeenCalledWith('room-id');
    expect(socket.emit).toHaveBeenCalledWith('new-room-join', 'test-user has joined the room.');
  });

  it('should handle errors and call the socketErrorHandler', async () => {
    onlineUsers.get = jest.fn().mockReturnValue('test1');
    rooms.get = jest.fn().mockReturnValue({
      teamNumberOfPlayers: 2,
      roundTime: 60,
      roundsToPlay: 3,
      _id: 'room-id',
      createdBy: 'test-user',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      teamAPlayers: new Set(['test']),
      teamBPlayers: new Set(['test1']),
      teamAPoints: 0,
      teamBPoints: 0,
      wordGuessed: false,
      stealWord: false,
      currentWord: '',
      currentTeam: 'teamAPlayers',
      wordsHistory: [],
      currentPlayer: '',
      finishedTurns: 0,
      hinted: false,
    })
    const playerReadyFn = playerReady(socket);
    await playerReadyFn();

    expect(socketErrorHandler).toHaveBeenCalledWith(socket, expect.any(CustomError));
  });
});
