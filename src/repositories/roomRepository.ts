import { GameRoomDto } from '../dtos/GameRoomDto';
import nano from 'nano';
const couch = nano('http://admin:admin@localhost:5984');
const room = couch.db.use('gameroom');

class RoomRepository {
  async create(gameRoom: GameRoomDto): Promise<void> {
    await room.insert(gameRoom);
  }

  async get(roomId: string): Promise<GameRoomDto> {
    const mangoQuery: nano.MangoQuery = {
      selector: {
        _id: `${roomId}`,
      },
    };
    return (await room.find(mangoQuery)).docs[0] as unknown as GameRoomDto;
  }

  async join(gameRoom: GameRoomDto): Promise<void> {
    await room.insert(gameRoom);
  }

  async leave(gameRoom: GameRoomDto): Promise<void> {
    await room.insert(gameRoom);
  }
}
export default new RoomRepository();
export { RoomRepository };
