import { GameRoom } from '../../../interfaces/GameInterfaces';
import { JSONSchemaType } from 'ajv';

export const gameRoomSchema: JSONSchemaType<GameRoom> = {
  type: 'object',
  properties: {
    teamNumberOfPlayers: { type: 'number', minimum: 2, maximum: 8 },
    roundTime: { type: 'number', minimum: 10, maximum: 120 },
    roundsToPlay: { type: 'number', minimum: 4, maximum: 20 },
  },
  required: ['teamNumberOfPlayers', 'roundTime', 'roundsToPlay'],
};
