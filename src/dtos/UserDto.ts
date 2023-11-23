import { IUser } from "../interfaces/IUser";

export class UserDto implements Partial<IUser> {
  email: string;
  password: string; //I changed the field to 'password'
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "inactive";
  createdAt: string;
  updatedAt: string;

  constructor(
    user: IUser,
    password: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.email = user.email;
    this.password = password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
