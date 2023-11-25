import { IChatMessage } from '../interfaces/IChatMessage';

export class ChatMessageDto implements IChatMessage {
  _id: string;
  message: string;
  roomId: string;
  createdBy: string;
  createdAt: string;

  constructor(
    messageId: string,
    chatMessage: IChatMessage,
    roomId: string,
    createdBy: string,
    createdAt: string,
  ) {
    this._id = messageId || '';
    this.message = chatMessage.message || ''; 
    this.roomId = roomId || '';
    this.createdBy = createdBy || '';
    this.createdAt = createdAt || '';
  }
}