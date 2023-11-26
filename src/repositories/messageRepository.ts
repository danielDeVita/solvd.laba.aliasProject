import { ChatMessageDto } from "../dtos/ChatMessageDto";
import { databases } from '../db/couchDb';

export class MessageRepository {
  async create(chatMessage: ChatMessageDto): Promise<void> {
    const message = await databases.messages;
    
    await message.insert(chatMessage);
  }

  async get(messageId: string): Promise<ChatMessageDto> {
    const message = await databases.messages;
    const mangoQuery = {
      selector: {
        _id: `${messageId}`,
      },
    };
    return (await message.find(mangoQuery)).docs[0] as unknown as ChatMessageDto;
  }

  async getAll(): Promise<ChatMessageDto[]> {
    const message = await databases.messages;
    const mangoQuery = {
      selector: {},
    };
    return (await message.find(mangoQuery)).docs as unknown as ChatMessageDto[];
  }

  async getAllByRoomId(roomId: string): Promise<ChatMessageDto[]> {
    const message = await databases.messages;
    const mangoQuery = {
      selector: {
        roomId: `${roomId}`,
      },
    };
    return (await message.find(mangoQuery)).docs as unknown as ChatMessageDto[];
  }

  async getBySenderId(senderId: string): Promise<ChatMessageDto[]> {
    const message = await databases.messages;
    const mangoQuery = {
      selector: {
        senderId: `${senderId}`,
      },
    };
    return (await message.find(mangoQuery)).docs as unknown as ChatMessageDto[];
  }
}

export default new MessageRepository();