import messageRepository, { MessageRepository } from "../repositories/messageRepository";
import { ChatMessageDto } from "../dtos/ChatMessageDto";
import { v4 as uuid } from 'uuid';
import { CustomError } from "../helpers/CustomError";
import { IChatMessage } from "../interfaces/IChatMessage";

export class ChatMessageService{
  private messageRepository: MessageRepository;

  constructor(messageRepository: MessageRepository) {
    this.messageRepository = messageRepository;
  }

  async create(chatMessage: IChatMessage): Promise<ChatMessageDto> {
    const newMessage = {
      _id: uuid(),
      message: chatMessage.message,
      roomId: chatMessage.roomId,
      createdBy: chatMessage.createdBy,
      createdAt: new Date().toISOString()
    }
    
    await this.messageRepository.create(newMessage);

    return this.messageRepository.get(newMessage._id);
 }

  async get(messageId: string): Promise<ChatMessageDto> {
    const foundMessage = await this.messageRepository.get(messageId);
    if (!foundMessage) {
      throw new CustomError('Message not found', 404);
    }
    return foundMessage;
  }

  async getAll(): Promise<ChatMessageDto[]> {
    return await this.messageRepository.getAll();
  }

  async getAllByRoomId(roomId: string): Promise<ChatMessageDto[]> {
    const foundMessagesByRoomId = await this.messageRepository.getAllByRoomId(roomId);
    
    if (!foundMessagesByRoomId) {
      throw new CustomError('Room not found', 404);
    }
    return foundMessagesByRoomId;
  }

  async getBySenderId(senderId: string): Promise<ChatMessageDto[]> {
    const foundMessagesBySenderId = await this.messageRepository.getBySenderId(senderId);
    if (!foundMessagesBySenderId) {
      throw new CustomError('Sender not found', 404);
    }
    return foundMessagesBySenderId;
  }
}

export default new ChatMessageService(messageRepository);