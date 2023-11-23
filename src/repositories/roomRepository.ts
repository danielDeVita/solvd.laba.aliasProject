import { GameRoomDto } from '../dtos/GameRoomDto';
import { databases } from '../db/couchDb';


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

  async join(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }

  async leave(gameRoom: GameRoomDto): Promise<void> {
    const room = await databases.gameRoom;
    await room.insert(gameRoom);
  }
}
export default new RoomRepository();
export { RoomRepository };
