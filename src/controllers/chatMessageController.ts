import { Request, Response, NextFunction } from 'express';
import chatMessageService, { ChatMessageService } from "../services/chatMessageService";

class ChatMessageController {
  private chatMessageService: ChatMessageService;

  constructor(chatMessageService: ChatMessageService) {
    this.chatMessageService = chatMessageService;
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createdMessage = await this.chatMessageService.create(req.body);
      res.status(201).json(createdMessage);
    } catch (error) {
      next(error);
    }
  };


  get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const foundMessage = await this.chatMessageService.get(req.params.messageId);
      res.status(200).json(foundMessage);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<void> => {
    try {
      const foundMessages = await this.chatMessageService.getAll();
      res.status(200).json(foundMessages);
    } catch (error) {
      next(error);
    }
  }

  getByRoomId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<void> => {
    try {
      const foundMessagesByRoomId = await this.chatMessageService.getAllByRoomId(req.params.room);
      res.status(200).json(foundMessagesByRoomId);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatMessageController(chatMessageService);
