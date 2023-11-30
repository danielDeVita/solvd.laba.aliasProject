import { GameRoomDto } from '../dtos/GameRoomDto';
import { databases } from '../db/couchDb';
import { MangoQuery } from 'nano';
import { IGameRoom } from '../interfaces/IGameRoom';
import { StoredGameRoomDto } from '../dtos/StoredRoom';

class RoomRepository {
  async create(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }

  async get(roomId: string): Promise<StoredGameRoomDto> {
    const room = await databases.gameRoom;
    const mangoQuery = {
      selector: {
        _id: `${roomId}`,
      },
    };
    const storedRoom = (await room.find(mangoQuery)).docs[0] as IGameRoom;
    const gameRoomDto = new StoredGameRoomDto(storedRoom);
    return gameRoomDto;
  }

  async getAll(): Promise<StoredGameRoomDto[]> {
    const room = await databases.gameRoom;
    const mangoQuery = {
      selector: {},
    };
    const rooms = ((await room.find(mangoQuery)).docs as IGameRoom[]).map(
      (storedGameRoom) => new StoredGameRoomDto(storedGameRoom)
    );
    return rooms;
  }

  async join(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }

  async leave(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }

  async updateEndGameRoomState(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }

  async getByUserId(userId: string) {
    const room = await databases.gameRoom;

    const mangoQuery: MangoQuery = {
      selector: {
        $or: [
          {
            teamAPlayers: {
              $elemMatch: {
                $eq: userId,
              },
            },
          },
          {
            teamBPlayers: {
              $elemMatch: {
                $eq: userId,
              },
            },
          },
        ],
      },
    };
    return (await room.find(mangoQuery)).docs as unknown as GameRoomDto[];
  }
}
export default new RoomRepository();
export { RoomRepository };
