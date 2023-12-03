import { guessWord } from '../../../services/game/guessWord';
import { Server, Socket } from 'socket.io';
import { onlineUsers } from '../../../repositories/inMemory/onlineUsers';
import { rooms } from '../../../repositories/inMemory/rooms';
import { CustomError } from '../../../helpers/CustomError';
import { GameState } from '../../../interfaces/GameInterfaces';

describe('guessWord', () => {
  let mockSocket: Partial<Socket>;
  let mockIO: Partial<Server>;

  beforeEach(() => {
    mockSocket = {
      id: 'mockedSocketId',
      emit: jest.fn()
    };

    mockIO = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    onlineUsers.set('mockedSocketId', { username: 'testUser', roomId: 'mockedRoomId' });

    const mockGameState: GameState = {
      teamNumberOfPlayers: 5,
      roundTime: 60,
      roundsToPlay: 10,
      _id: 'game123',
      createdBy: 'user123',
      createdAt: '2023-12-01T08:00:00Z',
      updatedAt: '2023-12-02T15:30:00Z',
      hinted: false,
      teamAPlayers: new Set(['mockedSocketId']),
      teamBPlayers: new Set(),
      wordGuessed: false,
      stealWord: false,
      currentWord: 'testWord',
      currentTeam: 'teamAPlayers',
      wordsHistory: [],
      currentPlayer: 'currentPlayerId',
      finishedTurns: 0,
      teamAPoints: 0,
      teamBPoints: 0,
    };

    rooms.set('mockedRoomId', mockGameState);
  });

  afterEach(() => {
    onlineUsers.clear();
    rooms.clear();
  });

  it('should handle word guessing correctly', () => {
    const mockSocketHandler = guessWord(mockSocket as Socket, mockIO as Server);
    mockSocketHandler({ word: 'testWord' });
    
    expect(mockIO.to).toHaveBeenCalledWith('mockedRoomId');
    expect(mockIO.emit).toHaveBeenCalledWith('correct-guess', 'testUser guessed testWord correctly!');
  });

  it('should handle incorrect word guessing correctly', () => {
    const mockSocketHandler = guessWord(mockSocket as Socket, mockIO as Server);
    mockSocketHandler({ word: 'incorrectWord' });

    const gameState = rooms.get('mockedRoomId');

    expect(gameState?.wordGuessed).toBe(false);
    expect(gameState?.teamAPoints).toBe(0);
    expect(mockIO.to).toHaveBeenCalledWith('mockedRoomId');
    expect(mockIO.emit).toHaveBeenCalledWith('incorrect-guess', 'testUser guessed incorrectWord which was incorrect');
  });

});