import { IJoinGameRoomInfo } from '../../../interfaces/GameInterfaces';
import { JSONSchemaType } from 'ajv';

export const gameJoinRoomSchema: JSONSchemaType<IJoinGameRoomInfo> = {
  type: 'object',
  properties: {
    roomId: { type: 'string' },
    team: { type: 'string', enum: ['teamA', 'teamB'] },
  },
  required: ['team'],
  not: {
    required: ['roomId'],
  },
};
