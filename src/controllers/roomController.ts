import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/roomService';
import roomService from '../services/roomService';
import { IJoinGameRoomInfo } from '../interfaces/GameInterfaces';
import { CustomError } from '../helpers/CustomError';

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
      const createdRoom = await this.roomService.create(
        req.body,
        req.headers.userId as string
      );
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
  };

  /**
   * Join a game room by an id and a specified team
   */
  join = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joinInfo: IJoinGameRoomInfo = {
        team: req.body.team,
        roomId: req.params.id,
      };

      const roomToJoin = await this.roomService.join(
        joinInfo,
        req.headers.userId as string
      );
      res.status(200).json(roomToJoin);
    } catch (error) {
      next(error);
    }
  };

  getByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const order = req.query.order || 'asc';
    const pageOffset = Number(req.query.pageOffset) || 0;
    const pages = Number(req.query.pages) || 10;

    try {
      if (typeof userId != 'string')
        throw new CustomError('Invalid userId', 400);

      if (!(order == 'asc' || order == 'desc'))
        throw new CustomError('Order must be "asc" or "desc"', 400);

      if (!(pageOffset >= 0) || !(pages >= 0))
        throw new CustomError('pageOffset and pages must be >= 0', 400);

      const rooms = await this.roomService.getByUserId(
        userId,
        order,
        pageOffset,
        pages
      );
      res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  };
}

export default new RoomController(roomService);
