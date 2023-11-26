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

export interface IJoinGameRoomInfo {
  roomId: string;
  team: 'teamA' | 'teamB';
}

export interface gameRoomPoints {
  teamAPoints: number;
  teamBPoints: number;
}
