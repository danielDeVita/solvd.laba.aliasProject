import { IChatMessage } from '../../../interfaces/IChatMessage';
import { JSONSchemaType } from 'ajv';

export const chatMessageSchema: JSONSchemaType<IChatMessage> = {
  type: 'object',
  properties: {
    message: { type: 'string', minLength: 1 },
  },
  required: ['message'],
};
