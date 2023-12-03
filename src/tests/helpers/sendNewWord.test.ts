import { Server, Socket } from 'socket.io';
import { GameState } from '../../interfaces/GameInterfaces';
import { sendNewWordTo } from '../../helpers/sendNewWordTo';
import { getUniqueWord } from '../../helpers/getUniqueWord';

jest.mock('../../repositories/inMemory/onlineUsers', () => ({
  onlineUsers: {
    get: jest.fn((userInfo)=> ({ username: userInfo })),
  },
}));

jest.mock('../../helpers/getUniqueWord', () => ({
  getUniqueWord: jest.fn(()=> 'newWord'),
}));

describe('sendNewWordTo', () => {
  let gameState: GameState;
  let socket: any;
  let io: any;

  beforeEach(() => {
    gameState = {
      teamNumberOfPlayers: 5,
      roundTime: 60,
      roundsToPlay: 10,
      _id: 'game123',
      createdBy: 'user123',
      createdAt: '2023-12-01T08:00:00Z',
      updatedAt: '2023-12-02T15:30:00Z',
      teamAPlayers: new Set(['player1', 'player2', 'player3']),
      teamBPlayers: new Set(['player4', 'player5']),
      teamAPoints: 3,
      teamBPoints: 2,
      wordGuessed: false,
      stealWord: false,
      currentWord: 'apple',
      currentTeam: 'teamAPlayers',
      wordsHistory: ['banana', 'orange', 'grape'],
      currentPlayer: 'player1',
      finishedTurns: 5,
      hinted: false,
    };
    socket = {
      id: 'player1',
      emit: jest.fn(),
      to: jest.fn(() => ({
        emit: jest.fn(()=>{}),
      })),
    };
    io = {
      to: jest.fn(() => ({
        emit: jest.fn(()=>{}),
      })),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('should send new word to player and emit event to socket if conditions are met', () => {
    sendNewWordTo(gameState, socket, io);

    expect(gameState.currentWord).toBe('newWord');
    expect(gameState.wordGuessed).toBe(false);
    expect(gameState.hinted).toBe(false);
    expect(socket.emit).toHaveBeenCalledWith('new-word', 'newWord');
    expect(io.to).toHaveBeenCalledWith(gameState._id);
  });

  it('should keep current player and send new word to that player if keepPlayer is true', () => {
    gameState.stealWord = false;
    gameState.wordGuessed = false;
    socket.id = 'player3';
    sendNewWordTo(gameState, socket, io, true);
  
    expect(gameState.currentPlayer).toBe('player3'); 
    expect(io.to).toHaveBeenCalledWith(gameState._id);
  });

  it('should rotate players and send new word to next player if keepPlayer is false', () => {
    gameState.stealWord = false;
    gameState.wordGuessed = false;

    sendNewWordTo(gameState, socket, io);

    expect(gameState.currentPlayer).toBe('player1');
    expect(gameState.teamAPlayers.has('player1')).toBe(true);
    expect(socket.emit).toHaveBeenCalledWith('new-word', expect.any(String));
    expect(io.to).toHaveBeenCalledWith(gameState._id);
  });
});