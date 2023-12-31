import { GameRoom, gameRoomPoints } from '../interfaces/GameInterfaces';
import { IJoinGameRoomInfo } from '../interfaces/GameInterfaces';
import { RoomRepository } from '../repositories/roomRepository';
import roomRepository from '../repositories/roomRepository';
import { CustomError } from '../helpers/CustomError';
import { GameRoomDto } from '../dtos/GameRoomDto';
import { v4 as uuid } from 'uuid';

class RoomService {
  private roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  async create(gameRoom: GameRoom, userId: string): Promise<GameRoomDto> {
    const creationDate = new Date().toISOString();
    const createdGameRoom = new GameRoomDto(
      gameRoom,
      uuid(),
      userId,
      creationDate,
      creationDate
    );

    await this.roomRepository.create(createdGameRoom);
      
    return await this.roomRepository.get(createdGameRoom._id);
  }

  async get(roomId: string): Promise<GameRoomDto> {
    const createdGameRoom = await this.roomRepository.get(roomId);
    if (!createdGameRoom) throw new CustomError('Room not found', 404);
    return createdGameRoom;
  }

  async getAll(): Promise<GameRoomDto[]> {
    return await this.roomRepository.getAll();
  }

  async join(
    joinInfo: IJoinGameRoomInfo,
    userId: string
  ): Promise<GameRoomDto> {
    const roomToJoin = await this.roomRepository.get(joinInfo.roomId);

    if (!roomToJoin) {
      throw new CustomError('Room not found', 404);
    }

    // Check if user is already in a team
    if (
      roomToJoin.teamAPlayers.includes(userId) ||
      roomToJoin.teamBPlayers.includes(userId)
    )
      throw new CustomError('User is already in a team', 403);

    const teamToJoin =
      joinInfo.team == 'teamA' ? 'teamAPlayers' : 'teamBPlayers';

    // Checking if selected team is complete
    if (roomToJoin[teamToJoin].length >= roomToJoin.teamNumberOfPlayers)
      throw new CustomError('Selected team is complete', 403);

    // Joining to a team
    roomToJoin[teamToJoin].push(userId);

    roomToJoin.updatedAt = new Date().toISOString();
    await this.roomRepository.join(roomToJoin);

    return await this.roomRepository.get(joinInfo.roomId);
  }

  /**
   * Though to be used with web sockets. As the most probably
   * scenario of a user leaving is because he disconnected
   * from the game.
   */
  async leave(roomId: string): Promise<void> {
    // To be changed by user identification after
    // the middleware for getting the id is finished
    const mockedUserName = uuid();

    const gameRoom = await this.get(roomId);

    if (!gameRoom) {
      throw new CustomError('Room not found', 404);
    }

    // Removing user from teamA in case is on teamA
    gameRoom.teamAPlayers = gameRoom.teamAPlayers.filter(
      (player) => player != mockedUserName
    );

    // Removing user from teamB in case is on teamB
    gameRoom.teamBPlayers = gameRoom.teamBPlayers.filter(
      (player) => player != mockedUserName
    );

    gameRoom.updatedAt = new Date().toISOString();
    this.roomRepository.leave(gameRoom);
  }

  async updateEndGameRoomState(
    roomId: string,
    gameRoomPoints: gameRoomPoints
  ): Promise<void> {
    const gameRoom = await this.roomRepository.get(roomId);
    gameRoom.teamAPoints = gameRoomPoints.teamAPoints;
    gameRoom.teamBPoints = gameRoomPoints.teamBPoints;
    await this.roomRepository.updateEndGameRoomState(gameRoom);
  }

  async getByUserId(
    userId: string,
    order: 'asc' | 'desc',
    pageOffset: number,
    pages: number
  ) {
    const rooms = await this.roomRepository.getByUserId(userId);

    const ordering = order == 'asc' ? 1 : -1;

    const sortedRooms = rooms.sort(
      (a: GameRoomDto, b: GameRoomDto) =>
        ordering * Number(new Date(a.createdAt)) -
        ordering * Number(new Date(b.createdAt))
    );

    return sortedRooms.slice(
      Number(pageOffset),
      Number(pageOffset) + Number(pages)
    );
  }
}
export default new RoomService(roomRepository);
export { RoomService };
