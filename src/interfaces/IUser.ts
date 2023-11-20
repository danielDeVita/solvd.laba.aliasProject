export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  role: 'user' | 'admin' | "inactive";
}
