import { IWord } from '../../../interfaces/GameInterfaces';
import { JSONSchemaType } from 'ajv';

export const userSchema: JSONSchemaType<IWord> = {
  type: 'object',
  properties: {
    word: { type: 'string', minLength: 1 },
  },
  required: ['word'],
};
