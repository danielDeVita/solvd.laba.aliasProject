import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/roomService';
import roomService from '../services/roomService';

class RoomController {
  private roomService: RoomService;

  constructor(roomService: RoomService) {
    this.roomService = roomService;
  }

  /**
   * Create a game room and return the created room
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createdRoom = await this.roomService.create(req.body);
      res.status(201).json(createdRoom);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Returns a game room by its id
   */
  get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createdGameRoom = await this.roomService.get(req.params.id);

      res.status(200).json(createdGameRoom);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const createdGameRooms = await this.roomService.getAll();
      res.status(200).json(createdGameRooms);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Join a game room by an id and a specified team
   */
  join = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomToJoin = await this.roomService.join(req.body);
      res.status(200).json(roomToJoin);
    } catch (error) {
      next(error);
    }
  };
}

export default new RoomController(roomService);
