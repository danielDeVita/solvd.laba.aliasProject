import { GameState } from '../../../interfaces/GameInterfaces';
import { onlineUsers } from '../../../repositories/inMemory/onlineUsers';
import { rooms } from '../../../repositories/inMemory/rooms';
import { disconnect } from '../../../services/game/disconnect';
import { Socket } from 'socket.io';

describe('disconnect', () => {
  let mockSocket: Partial<Socket>;
  let mockOnlineUsers: Map<string, any>;
  let mockRooms: Map<string, any>;

  beforeEach(() => {
    mockSocket = {
      id: 'mockedSocketId',
      leave: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    mockOnlineUsers = new Map();
    mockRooms = new Map();
  });

  it('should handle user disconnection', () => {
    // Mocking user and game state
    const user = {
      roomId: 'mockedRoomId',
      username: 'testUser',
    };
    const gameState : GameState = {
      teamNumberOfPlayers: 5,
      roundTime: 60,
      roundsToPlay: 10,
      _id: 'game123',
      createdBy: 'user123',
      createdAt: '2023-12-01T08:00:00Z',
      updatedAt: '2023-12-02T15:30:00Z',
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
      teamAPlayers: new Set<string>(['mockedSocketId']), 
      teamBPlayers: new Set<string>([]),
    };

    jest.spyOn(onlineUsers, 'get').mockReturnValue(user);
    jest.spyOn(rooms, 'get').mockReturnValue(gameState);

    mockOnlineUsers.set('mockedSocketId', user);
    mockRooms.set('mockedRoomId', gameState);

    // Triggering disconnection
    const disconnectHandler = disconnect(mockSocket as Socket);
    disconnectHandler();

    // Assertions
    expect(mockRooms.get('mockedRoomId')).toEqual({
      ...gameState,
      teamAPlayers: new Set(), // expecting an empty set after disconnection
      teamBPlayers: new Set(),
    });

    expect(mockSocket.to).toHaveBeenCalledWith('mockedRoomId');
    expect(mockSocket.leave).toHaveBeenCalledWith('mockedRoomId');
    expect(mockSocket.emit).toHaveBeenCalledWith('user-left', 'testUser has left the room');
  });
});