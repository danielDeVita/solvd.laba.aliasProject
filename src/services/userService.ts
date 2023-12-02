import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../repositories/userRepository';
import jwt from 'jsonwebtoken';
import { UserDto } from '../dtos/UserDto';
import { CustomError } from '../helpers/CustomError';

export const registerUserService = async (userData: UserDto) => {
  const { email, firstName, lastName, role, password, createdAt, updatedAt } =
    userData;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new CustomError('User already exists', 409);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user: UserDto = {
    email,
    firstName,
    lastName,
    role,
    password: hashedPassword,
    createdAt,
    updatedAt,
  };

  const userCreated = await createUser(user);

  return userCreated;
};

export const loginUserService = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    `${process.env.JWT_SECRET}`,
    { expiresIn: '1h' }
  );

  return token;
};
