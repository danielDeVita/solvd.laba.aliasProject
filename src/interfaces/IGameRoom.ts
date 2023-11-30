import * as Nano from 'nano';

export interface IGameRoom extends Nano.MaybeDocument {
  _id: string,
  _rev: string | undefined,
  teamNumberOfPlayers: number;
  roundTime: number;
  roundsToPlay: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  teamAPlayers: string[];
  teamBPlayers: string[];
  teamAPoints: number;
  teamBPoints: number;
}
