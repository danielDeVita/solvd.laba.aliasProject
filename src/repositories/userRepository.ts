import { databases } from '../db/couchDb';
// import { IUser } from '../interfaces/IUser';
import { UserDto } from '../dtos/UserDto';
import Nano from 'nano';

export const createUser = async (userDto: UserDto) => {
  const {
    email,
    password,
    firstName,
    lastName,
    role,
    // createdAt,
    // updatedAt,
  } = userDto;

  const userDocument: UserDto = {
    // id,
    email,
    password,
    firstName,
    lastName,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const userDocumentWithType = userDocument as
    | Nano.MaybeDocument
    | Nano.ViewDocument<unknown>;

  try {
    const usersDatabase = await databases.users;

    return await usersDatabase.insert(userDocumentWithType);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findUserByEmail = async (email: string) => {
  const result = await (
    await databases.users
  ).find({
    selector: {
      email: email,
    },
  });

  return result.docs[0] as unknown as UserDto;
};
