import { server } from '../../app';
import { authSocket } from '../../middlewares/auth/authSocket';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import request from 'supertest';

let mockedSocket: any;

const mockedCallback = () => {};

beforeEach(() => {
  mockedSocket = {
    id: 'authTokenId',
    handshake: {
      headers: {
        authorization: 'Bearer: invalidToken',
        roomid: 'someRoomId',
      },
    },
    emit: jest.fn(),
  };
  onlineUsers.clear();
});

afterEach(() => {
  onlineUsers.clear();
});

beforeAll(() => {
  server.close();
});

describe('Test authSocket middleware', () => {
  it('Should set user as online if token is valid', async () => {
    // Create user and store into db
    const user = {
      email: 'bobo@gmail.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'user',
    };

    await request(server).post('/user/register').send(user);

    // Login user and get token
    const loginUserRes = await request(server)
      .post('/user/login')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    mockedSocket = {
      id: 'authTokenId',
      handshake: {
        headers: {
          authorization: `Bearer: ${loginUserRes.body.token}`,
          roomid: 'someRoomId',
        },
      },
    };

    authSocket(mockedSocket, mockedCallback);
    expect(onlineUsers.has(mockedSocket.id)).toBeTruthy();
  });

  it('User should not be set as online if token is invalid', () => {
    authSocket(mockedSocket, mockedCallback);
    expect(onlineUsers.has(mockedSocket.id)).toBeFalsy();
  });
});
