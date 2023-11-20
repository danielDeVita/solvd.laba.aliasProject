import { IUser } from '../interfaces/IUser';

// Declared as Partial<IUser> as password is ignored
export class UserDto implements Partial<IUser> {
  id: string;
  email: string;
  salt: string;
  hashedPassword: string;
  name: string;
  lastName: string;
  role: 'user' | 'admin' | 'inactive';
  createdAt: string;
  updatedAt: string;

  constructor(
    user: IUser,
    salt: string,
    hashedPassword: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = user.id;
    this.email = user.email;
    this.salt = salt;
    this.hashedPassword = hashedPassword;
    this.name = user.name;
    this.lastName = user.lastName;
    this.role = user.role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
