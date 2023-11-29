export interface IChatMessage {
  message: string;
  roomId: string;
  createdBy: string;
}

export interface IIncomingSocketMessage {
  message: string;
}

export interface IOutgoingSocketMessage {
  message: string;
  roomId: string;
  createdBy: string;
  createdAt: string;
}
