export interface IWord {
  word: string;
}

export interface IisCorrectWord {
  isCorrectWord: true | false;
}

export interface GameRoom {
  teamNumberOfPlayers: number;
  roundTime: number;
  roundsToPlay: number;
}

export interface GameState {
  teamNumberOfPlayers: number;
  roundTime: number;
  roundsToPlay: number;
  _id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  teamAPlayers: Set<string>; // has socket ids
  teamBPlayers: Set<string>;
  teamAPoints: number;
  teamBPoints: number;
  wordGuessed: boolean;
  stealWord: boolean;
  currentWord: string;
  currentTeam: 'teamAPlayers' | 'teamBPlayers';
  wordsHistory: string[];
  currentPlayer: string; //socket id of player giving hints
  finishedTurns: number;
  hinted: boolean; // whether a hint has been given for current word or not
}

export interface IJoinGameRoomInfo {
  roomId: string;
  team: 'teamA' | 'teamB';
}

export interface gameRoomPoints {
  teamAPoints: number;
  teamBPoints: number;
}
  
export interface IRoomId {
  roomId: string;
}

export interface IHint {
  hint: string;
}

export interface IPlayerReadyInfo {
  roomId: string;
  username: string;
}
