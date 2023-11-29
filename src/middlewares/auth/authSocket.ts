/* eslint-disable @typescript-eslint/no-explicit-any */
import { socketErrorHandler } from '../errorHandlers/socketErrorHandler';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { DecodedToken } from '../../interfaces/IDecodedToken';
import { CustomError } from '../../helpers/CustomError';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export const authSocket = (socket: Socket, next: any) => {
  // Getting token and roomId
  const token = socket.handshake.headers.authorization?.split(' ')[1];
  const roomId = socket.handshake.headers.roomid;

  // Checking if token has been sent
  if (!token) {
    socketErrorHandler(
      socket,
      new CustomError('Unauthorized: Missing token', 401)
    );
  }

  // Verifying token
  jwt.verify(
    token as string,
    `${process.env.JWT_SECRET}`,
    (err: VerifyErrors | null, decoded: any | undefined) => {
      if (err || !(typeof roomId == 'string')) {
        // If token is invalid
        socketErrorHandler(
          socket,
          new CustomError('Forbidden: Invalid token or roomId', 403)
        );
      } else {
        // If token is valid
        // Get user information
        const decodedToken = decoded as DecodedToken;
        const userInformation = decodedToken;

        // adding user to the onlineUsers, this onlineUsers allows us
        // to track the user information, just knowing his socket id.
        onlineUsers.set(socket.id, {
          username: userInformation.email,
          roomId: roomId,
        });

        next();
      }
    }
  );
};
