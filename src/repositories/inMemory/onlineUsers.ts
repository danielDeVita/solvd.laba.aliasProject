import { IPlayerReadyInfo } from '../../interfaces/GameInterfaces';

export const onlineUsers: Map<string, IPlayerReadyInfo> = new Map(); // socket ID, {userName, roomId}
