import { IUser } from '../../../interfaces/IUser';
import { JSONSchemaType } from 'ajv';

export const userSchema: JSONSchemaType<IUser> = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 6, maxLength: 16 },
    email: { type: 'string', minLength: 6 },
    password: { type: 'string', minLength: 8, maxLength: 32 },
    name: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    role: { type: 'string', enum: ['user', 'admin', 'inactive'] },
  },
  required: ['id', 'email', 'password', 'name', 'lastName', 'role'],
};
