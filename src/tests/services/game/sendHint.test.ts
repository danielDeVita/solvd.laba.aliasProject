import { Server, Socket } from 'socket.io';
import { socketErrorHandler } from '../../../middlewares/errorHandlers/socketErrorHandler';
import { onlineUsers } from '../../../repositories/inMemory/onlineUsers';
import { rooms } from '../../../repositories/inMemory/rooms';
import { sendHint } from '../../../services/game/sendHint'; // Подставьте путь к вашему файлу с функцией sendHint
import { GameState } from '../../../interfaces/GameInterfaces';

jest.mock('../../../repositories/inMemory/onlineUsers', () => ({
  onlineUsers: {
    get: jest.fn(),
  },
}));

jest.mock('../../../repositories/inMemory/rooms', () => ({
  rooms: {
    get: jest.fn(),
  },
}));

jest.mock('../../../middlewares/errorHandlers/socketErrorHandler', () => ({
  socketErrorHandler: jest.fn(),
}));

const initialGameState = {
  teamNumberOfPlayers: 5,
  roundTime: 60,
  roundsToPlay: 3,
  _id: "abc123",
  createdBy: "John Doe",
  createdAt: "2021-01-01",
  updatedAt: "2021-01-02",
  teamAPlayers: new Set(["player1", "player2", "player3"]),
  teamBPlayers: new Set(["player4", "player5", "player6"]),
  teamAPoints: 0,
  teamBPoints: 0,
  wordGuessed: false,
  stealWord: false,
  currentWord: "apple",
  currentTeam: "teamAPlayers",
  wordsHistory: ["banana", "orange", "grape"],
  currentPlayer: "player1",
  finishedTurns: 2,
  hinted: true
}

describe('sendHint function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a hint successfully when all conditions are met', () => {
    const mockSocketId = 'mockSocketId';
    const mockRoomId = 'mockRoomId';
    const mockUsername = 'testUser';
    const mockHint = 'test hint';

    const mockUserInfo = { roomId: mockRoomId, username: mockUsername };
    const mockGameState = { ...initialGameState, _id: mockRoomId, currentPlayer: mockSocketId, currentWord: 'apple', hinted: false };

    const mockSocket = { id: mockSocketId };
    const mockIo: any = { to: jest.fn(() => mockIo as Server), emit: jest.fn() };

    jest.spyOn(onlineUsers, 'get').mockReturnValue(mockUserInfo);
    jest.spyOn(rooms, 'get').mockReturnValue(mockGameState as GameState);

    const hintFunction = sendHint(mockSocket as Socket, mockIo);
    hintFunction({ hint: mockHint });

    expect(onlineUsers.get).toHaveBeenCalledWith(mockSocketId);
    expect(rooms.get).toHaveBeenCalledWith(mockRoomId);
    expect(mockIo.to).toHaveBeenCalledWith(mockRoomId);
    expect(mockIo.emit).toHaveBeenCalledWith('show-hint', `${mockUsername} hinted: ${mockHint}`);
    expect(mockGameState.hinted).toBe(true);
    expect(socketErrorHandler).not.toHaveBeenCalled();
  });

  it('should handle error if sender is not allowed to send hint', () => {
    const mockSocketId = 'mockSocketId';
    const mockSocket = { id: mockSocketId };
    const mockUserInfo = { roomId: 'mockRoomId', username: 'testUser' };
    const mockGameState = {...initialGameState, _id: 'mockRoomId', currentPlayer: 'anotherSocketId', hinted: false };
    const mockIo: any = { to: jest.fn(() => mockIo as Server), emit: jest.fn() };

    jest.spyOn(onlineUsers, 'get').mockReturnValue(mockUserInfo);
    jest.spyOn(rooms, 'get').mockReturnValue(mockGameState as GameState);

    const hintFunction = sendHint(mockSocket as Socket, mockIo);
    hintFunction({ hint: 'test hint' });

    expect(socketErrorHandler).toHaveBeenCalled();
  });

  it('should handle error for invalid hint', () => {
    const mockSocketId = 'mockSocketId';
    const mockSocket = { id: mockSocketId };
    const mockUserInfo = { roomId: 'mockRoomId', username: 'testUser' };
    const mockGameState = {...initialGameState, _id: 'mockRoomId', currentPlayer: mockSocketId, currentWord: 'hint', hinted: false };
    const mockIo: any = { to: jest.fn(() => mockIo as Server), emit: jest.fn() };

    jest.spyOn(onlineUsers, 'get').mockReturnValue(mockUserInfo);
    jest.spyOn(rooms, 'get').mockReturnValue(mockGameState as GameState);

    const hintFunction = sendHint(mockSocket as Socket, mockIo);
    hintFunction({ hint: 'invalid hint' });

    expect(socketErrorHandler).toHaveBeenCalled();
  });
});
