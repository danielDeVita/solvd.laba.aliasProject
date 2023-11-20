import { IChatMessage } from '../interfaces/IChatMessage';

export class ChatMessageDto implements IChatMessage {
  message: string;
  roomId: string;
  createdBy: string;
  createdAt: string;

  constructor(
    chatMessage: IChatMessage,
    roomId: string,
    createdBy: string,
    createdAt: string
  ) {
    this.message = chatMessage.message;
    this.roomId = roomId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }
}
