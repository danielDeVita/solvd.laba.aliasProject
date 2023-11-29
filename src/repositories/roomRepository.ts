import { GameRoomDto } from '../dtos/GameRoomDto';
import { databases } from '../db/couchDb';
import { MangoQuery } from 'nano';

class RoomRepository {
  async create(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }

  async get(roomId: string): Promise<GameRoomDto> {
    const room = await databases.gameRoom;
    const mangoQuery = {
      selector: {
        _id: `${roomId}`,
      },
    };
    return (await room.find(mangoQuery)).docs[0] as unknown as GameRoomDto;
  }

  async getAll(): Promise<GameRoomDto[]> {
    const room = await databases.gameRoom;
    const mangoQuery = {
      selector: {},
    };
    return (await room.find(mangoQuery)).docs as unknown as GameRoomDto[];
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
