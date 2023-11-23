import { GameRoom } from '../interfaces/GameInterfaces';

export class GameRoomDto {
  teamNumberOfPlayers: number;
  roundTime: number;
  roundsToPlay: number;
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  teamAPoints: number;
  teamBPoints: number;

  constructor(
    gameRoom: GameRoom,
    roomId: string,
    createdBy: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.teamNumberOfPlayers = gameRoom.teamNumberOfPlayers;
    this.roundTime = gameRoom.roundTime;
    this.roundsToPlay = gameRoom.roundsToPlay;
    this._id = roomId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.teamAPlayers = [];
    this.teamBPlayers = [];
    this.teamAPoints = 0;
    this.teamBPoints = 0;
  }
}
