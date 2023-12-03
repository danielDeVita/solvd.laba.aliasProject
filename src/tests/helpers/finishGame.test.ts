import { finishGame } from "../../helpers/finishGame";
import { GameState } from "../../interfaces/GameInterfaces";
import { onlineUsers } from "../../repositories/inMemory/onlineUsers";
import { rooms } from "../../repositories/inMemory/rooms";
import RoomService from "../../services/roomService";

const mockRooms = new Map<string, any>();
const mockOnlineUsers = new Map<string, any>();

jest.mock("../../services/roomService", () => ({
  updateEndGameRoomState: jest.fn(),
}));

describe('finishGame', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });
  
  beforeEach(() => {
    (rooms as any).delete = jest.fn((id: string) => mockRooms.delete(id));
    (onlineUsers as any).delete = jest.fn((id: string) => mockOnlineUsers.delete(id));
  });
  
  it('should finish the game and clean up rooms and online users', () => {
    const gameState: GameState = {
      _id: 'gameId',
      teamNumberOfPlayers: 2,
      roundTime: 60,
      roundsToPlay: 5,
      createdBy: 'userId',
      createdAt: '2023-12-01T12:00:00.000Z',
      updatedAt: '2023-12-01T12:30:00.000Z',
      teamAPlayers: new Set<string>(['player1', 'player2']),
      teamBPlayers: new Set<string>(['player3', 'player4']),
      teamAPoints: 10,
      teamBPoints: 8,
      wordGuessed: false,
      stealWord: false,
      currentWord: 'example',
      currentTeam: 'teamAPlayers',
      wordsHistory: ['word1', 'word2'],
      currentPlayer: 'player1',
      finishedTurns: 3,
      hinted: true,
    };

    finishGame(gameState);

    expect(RoomService.updateEndGameRoomState).toHaveBeenCalledWith('gameId', {
      teamAPoints: 10,
      teamBPoints: 8,
    });

    expect(rooms.delete).toHaveBeenCalledWith('gameId');
  });

  it('should handle scenario when gameState has no players', () => {
    const gameStateWithoutPlayers: GameState = {
      _id: 'gameId',
      teamNumberOfPlayers: 2,
      roundTime: 60,
      roundsToPlay: 5,
      createdBy: 'userId',
      createdAt: '2023-12-01T12:00:00.000Z',
      updatedAt: '2023-12-01T12:30:00.000Z',
      teamAPlayers: new Set<string>(),
      teamBPlayers: new Set<string>(),
      teamAPoints: 10,
      teamBPoints: 8,
      wordGuessed: false,
      stealWord: false,
      currentWord: 'example',
      currentTeam: 'teamAPlayers',
      wordsHistory: ['word1', 'word2'],
      currentPlayer: 'player1',
      finishedTurns: 3,
      hinted: true,
    };

    finishGame(gameStateWithoutPlayers);

    expect(rooms.delete).toHaveBeenCalledWith('gameId');
    expect(onlineUsers.delete).not.toHaveBeenCalled();
  });
});