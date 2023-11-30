import { IGameRoom } from '../interfaces/IGameRoom';

export class StoredGameRoomDto {
  teamNumberOfPlayers: number;
  roundTime: number;
  roundsToPlay: number;
  _id: string;
  _rev: string | undefined;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  teamAPoints: number;
  teamBPoints: number;

  constructor(gameRoom: IGameRoom) {
    this.teamNumberOfPlayers = gameRoom.teamNumberOfPlayers;
    this.roundTime = gameRoom.roundTime;
    this.roundsToPlay = gameRoom.roundsToPlay;
    this._id = gameRoom._id;
    this._rev = gameRoom._rev;
    this.createdBy = gameRoom.createdBy;
    this.createdAt = gameRoom.createdAt;
    this.updatedAt = gameRoom.updatedAt;
    this.teamAPlayers = gameRoom.teamAPlayers;
    this.teamBPlayers = gameRoom.teamBPlayers;
    this.teamAPoints = gameRoom.teamAPoints;
    this.teamBPoints = gameRoom.teamBPoints;
  }
}
