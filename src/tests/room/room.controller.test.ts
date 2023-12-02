import { gameRoomPoints } from '../../interfaces/GameInterfaces';
import { GameRoomDto } from '../../dtos/GameRoomDto';
import roomService from '../../services/roomService';
import { server } from '../../app';
import request from 'supertest';
import Nano from 'nano';


const randomEmail1 = `EMAIL_1${Date.now()}@mail.com`; //to skip unique email validation
const randomEmail2 = `EMAIL_2${Date.now()}@mail.com`; //to skip unique email validation
const randomEmail3 = `EMAIL_3${Date.now()}@mail.com`; //to skip unique email validation


afterAll(async () => {
  // const couchdbUrl = `${process.env.COUCH_DB_URL}`;
  // const couch = Nano(couchdbUrl);
  // await couch.db.destroy('users');
  // await couch.db.destroy('gameroom');
  // await couch.db.destroy('messages');
  server.close();
});

// Users to create
const user1ToRegister = {
  email: randomEmail1,
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'user',
};

const user2ToRegister = {
  email: randomEmail2,
  password: 'password2',
  firstName: 'firstName2',
  lastName: 'lastName2',
  role: 'user',
};

const user3ToRegister = {
  email: randomEmail3,
  password: 'password3',
  firstName: 'firstName3',
  lastName: 'lastName3',
  role: 'user',
};

let authToken1: string;
let authToken2: string;
let authToken3: string;

// Rooms to create
const room1toCreate = {
  teamNumberOfPlayers: 2,
  roundTime: 60,
  roundsToPlay: 4,
};
const room2toCreate = {
  teamNumberOfPlayers: 4,
  roundTime: 120,
  roundsToPlay: 8,
};

const room3toCreate = {
  teamNumberOfPlayers: 3,
  roundTime: 88,
  roundsToPlay: 7,
};
let createdRoom1: GameRoomDto;
let createdRoom2: GameRoomDto;
let createdRoom3: GameRoomDto;

describe('Testing room routes', () => {
  it('Should create, login a user and get the auth token', async () => {
    // Create users
    await request(server)
      .post('/user/register')
      .send(user1ToRegister)
      .expect(200);

    await request(server)
      .post('/user/register')
      .send(user2ToRegister)
      .expect(200);

    await request(server)
      .post('/user/register')
      .send(user3ToRegister)
      .expect(200);

    // Login users and get tokens
    const res1 = await request(server)
      .post('/user/login')
      .send({
        email: user1ToRegister.email,
        password: user1ToRegister.password,
      })
      .expect(200);
    authToken1 = res1.body.token;

    const res2 = await request(server)
      .post('/user/login')
      .send({
        email: user2ToRegister.email,
        password: user2ToRegister.password,
      })
      .expect(200);
    authToken2 = res2.body.token;

    const res3 = await request(server)
      .post('/user/login')
      .send({
        email: user3ToRegister.email,
        password: user3ToRegister.password,
      })
      .expect(200);
    authToken3 = res3.body.token;
  });

  it('Post / should create a new room', async () => {
    // Creating multiple rooms
    const res = await request(server)
      .post('/room')
      .send(room1toCreate)
      .set('Authorization', `Bearer: ${authToken1}`)
      .expect(201);

    const res2 = await request(server)
      .post('/room')
      .send(room2toCreate)
      .set('Authorization', `Bearer: ${authToken2}`)
      .expect(201);

    const res3 = await request(server)
      .post('/room')
      .send(room3toCreate)
      .set('Authorization', `Bearer: ${authToken3}`)
      .expect(201);

    expect(res.body._id).toHaveLength(36);
    expect(res.body.teamNumberOfPlayers).toBe(
      room1toCreate.teamNumberOfPlayers
    );
    expect(res.body.roundTime).toBe(room1toCreate.roundTime);
    expect(res.body.roundsToPlay).toBe(room1toCreate.roundsToPlay);
    expect(res.body.createdBy).toMatch(user1ToRegister.email);
    expect(res.body.createdAt).toHaveLength(24);
    expect(res.body.updatedAt).toHaveLength(24);
    expect(res.body.teamAPlayers).toEqual([]);
    expect(res.body.teamBPlayers).toEqual([]);
    expect(res.body.teamAPoints).toBe(0);
    expect(res.body.teamBPoints).toBe(0);

    createdRoom1 = res.body;
    createdRoom2 = res2.body;
    createdRoom3 = res3.body;
  });

  it('Get /:id should return a room', async () => {
    const res = await request(server)
      .get(`/room/${createdRoom1._id}`)
      .set('Authorization', `Bearer: ${authToken1}`)
      .expect(200);

    expect(res.body).toEqual(createdRoom1);
  });

  it('Get / should return all rooms', async () => {
    const res = await request(server)
      .get('/room/')
      .set('Authorization', `Bearer: ${authToken1}`)
      .expect(200);

    expect(res.body).toContainEqual(createdRoom1);
    expect(res.body).toContainEqual(createdRoom2);
    expect(res.body).toContainEqual(createdRoom3);
  });

  it('Patch /:roomId should join user to the room', async () => {
    const res = await request(server)
      .patch(`/room/${createdRoom1._id}`)
      .set('Authorization', `Bearer: ${authToken1}`)
      .send({ team: 'teamA' })
      .expect(200);

    const res2 = await request(server)
      .patch(`/room/${createdRoom1._id}`)
      .set('Authorization', `Bearer: ${authToken2}`)
      .send({ team: 'teamA' })
      .expect(200);

    const res3 = await request(server)
      .patch(`/room/${createdRoom1._id}`)
      .set('Authorization', `Bearer: ${authToken3}`)
      .send({ team: 'teamB' })
      .expect(200);

    await request(server)
      .patch(`/room/${createdRoom2._id}`)
      .set('Authorization', `Bearer: ${authToken1}`)
      .send({ team: 'teamB' })
      .expect(200);

    await request(server)
      .patch(`/room/${createdRoom3._id}`)
      .set('Authorization', `Bearer: ${authToken1}`)
      .send({ team: 'teamA' })
      .expect(200);

    expect(res.body.teamAPlayers).toEqual([user1ToRegister.email]);
    expect(res2.body.teamAPlayers).toEqual([
      user1ToRegister.email,
      user2ToRegister.email,
    ]);
    expect(res3.body.teamBPlayers).toEqual([user3ToRegister.email]);
  });

  it('Get /user/:userId should return rooms where a user has plaid', async () => {
    const NUMBER_OF_ROOMS = 3;

    const res = await request(server)
      .get(`/room/user/${user1ToRegister.email}`)
      .set('Authorization', `Bearer: ${authToken1}`)
      .expect(200);

    expect(res.body).toHaveLength(NUMBER_OF_ROOMS);
  });

  it('Should update the end game room score', async () => {
    const gameRoomPoints: gameRoomPoints = {
      teamAPoints: 5,
      teamBPoints: 3,
    };

    await roomService.updateEndGameRoomState(createdRoom1._id, gameRoomPoints);
    const res = await request(server)
      .get(`/room/${createdRoom1._id}`)
      .set('Authorization', `Bearer: ${authToken1}`)
      .expect(200);

    expect(res.body.teamAPoints).toBe(gameRoomPoints.teamAPoints);
    expect(res.body.teamBPoints).toBe(gameRoomPoints.teamBPoints);
  });
});
