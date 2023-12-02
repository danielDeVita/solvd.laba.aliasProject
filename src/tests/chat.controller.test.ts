import { Request, Response, NextFunction } from 'express';
import ChatMessageController from '../controllers/chatMessageController';
import chatMessageService from '../services/chatMessageService';

jest.mock('../services/chatMessageService');

describe('ChatMessageController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;
  let controller: typeof ChatMessageController;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    controller = ChatMessageController;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('should create a chat message and return 201 status code', async () => {
      const mockCreatedMessage = { id: '1', text: 'Test message' };
      (chatMessageService.create as jest.Mock).mockResolvedValue(mockCreatedMessage);

      req.body = { text: 'Test message' };
      await controller.create(req as Request, res as Response, next);

      expect(chatMessageService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedMessage);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if chat message creation fails', async () => {
      const errorMessage = 'Error creating chat message';
      (chatMessageService.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

      req.body = { text: 'Test message' };
      await controller.create(req as Request, res as Response, next);

      expect(chatMessageService.create).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('get method', () => {
    it('should get a chat message by ID and return 200 status code', async () => {
      const mockFoundMessage = { id: '1', text: 'Test message' };
      (chatMessageService.get as jest.Mock).mockResolvedValue(mockFoundMessage);

      req.params = { messageId: '1' };
      await controller.get(req as Request, res as Response, next);

      expect(chatMessageService.get).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFoundMessage);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if getting chat message fails', async () => {
      const errorMessage = 'Error getting chat message';
      (chatMessageService.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      req.params = { messageId: '1' };
      await controller.get(req as Request, res as Response, next);

      expect(chatMessageService.get).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getAll method', () => {
    it('should get all chat messages and return 200 status code', async () => {
      const mockFoundMessages = [{ id: '1', text: 'Test message 1' }, { id: '2', text: 'Test message 2' }];
      (chatMessageService.getAll as jest.Mock).mockResolvedValue(mockFoundMessages);

      await controller.getAll(req as Request, res as Response, next);

      expect(chatMessageService.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFoundMessages);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if getting all chat messages fails', async () => {
      const errorMessage = 'Error getting chat messages';
      (chatMessageService.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await controller.getAll(req as Request, res as Response, next);

      expect(chatMessageService.getAll).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getByRoomId method', () => {
    beforeEach(() => {
      req = {
        params: {
          room: 'roomName',
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
      controller = ChatMessageController;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get all chat messages by room ID and return 200 status code', async () => {
      const mockFoundMessages = [{ id: '1', text: 'Test message 1' }, { id: '2', text: 'Test message 2' }];
      (chatMessageService.getAllByRoomId as jest.Mock).mockResolvedValue(mockFoundMessages);

      await controller.getByRoomId(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFoundMessages);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with an error if getting chat messages by room ID fails', async () => {
      const errorMessage = 'Error getting chat messages by room ID';
      (chatMessageService.getAllByRoomId as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await controller.getByRoomId(req as Request, res as Response, next);

      expect(chatMessageService.getAllByRoomId).toHaveBeenCalledWith('roomName');
      expect(next).toHaveBeenCalledWith(new Error(errorMessage));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});