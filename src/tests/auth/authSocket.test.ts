
import { authSocket } from '../../middlewares/auth/authSocket';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Handshake } from 'socket.io/dist/socket';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('authSocket', () => {
  let mockedSocket: Socket;

  beforeEach(() => {
    mockedSocket = {
      id: 'mockedSocketId',
      handshake: {
        headers: {} as any, 
      },
      emit: jest.fn(),
    } as any;

    jest.clearAllMocks();
  });

  it('should handle missing token', () => {
    delete mockedSocket.handshake.headers.authorization;

    authSocket(mockedSocket, jest.fn());

    expect(mockedSocket.handshake.headers.authorization).toBeUndefined();
  });

  it('should handle invalid token or roomId', () => {
    mockedSocket.handshake.headers.authorization = 'Bearer invalidToken';
    mockedSocket.handshake.headers.roomid = '123';

    jest.spyOn(jwt, 'verify').mockImplementation((_token, _secret, callback: any) => {
      callback(new Error('Invalid token'), null);
    })

    authSocket(mockedSocket, jest.fn());

    expect(jwt.verify).toHaveBeenCalled();
  });

  it('should authenticate and add user to onlineUsers', () => {
    const mockedDecodedToken = { email: 'user@example.com' };
    mockedSocket.handshake.headers.authorization = 'Bearer validToken';
    mockedSocket.handshake.headers.roomid = 'roomId';
    
    jest.spyOn(jwt, 'verify').mockImplementation((_token, _secret, callback: any) => {
      callback(null, mockedDecodedToken);
    })

    authSocket(mockedSocket, jest.fn());

    expect(jwt.verify).toHaveBeenCalled();
    expect(onlineUsers.get('mockedSocketId')).toEqual({
      username: 'user@example.com',
      roomId: 'roomId',
    });
  });
});