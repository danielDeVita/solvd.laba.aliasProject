/* eslint-disable @typescript-eslint/no-explicit-any */
import { onlineUsers } from '../repositories/inMemory/onlineUsers';
import { GameState } from '../interfaces/GameInterfaces';
import { disconnect } from '../services/game/disconnect';
import { rooms } from '../repositories/inMemory/rooms';
import { guessWord } from '../services/game/guessWord';
import { sendHint } from '../services/game/sendHint';
import { playerReady } from '../services/game/playerReady';
import request from 'supertest';
import { server } from '../../src/app';
import { startGame } from '../services/game/startGame';
import * as sinon from 'sinon';

// Creating mocked socket
const mockedSocket1Id = 'someSockedId1';
const mockedSocket2Id = 'someSockedId2';
const mockedSocket3Id = 'someSockedId3';
const mockedSocket4Id = 'someSockedId4';

let roomId: string;
let mockedUserInfo: any;
let mockedSocket1: any;
let mockedSocket2: any;
let mockedSocket3: any;
let mockedSocket4: any;

let mockedIO: any;

// Creating mocked Room
let mockedRoom: GameState;

beforeEach(async () => {
  roomId = 'someRoomId';
  mockedUserInfo = {
    username: 'someUserName@gmail.com',
    roomId: roomId,
  };
  // Creates mocked sockets
  mockedSocket1 = {
    id: mockedSocket1Id,
    leave: jest.fn(),
    to: jest.fn(() => mockedSocket1),
    emit: jest.fn(),
    join: jest.fn(),
  };
  mockedSocket2 = {
    id: mockedSocket2Id,
    leave: jest.fn(),
    to: jest.fn(() => mockedSocket2),
    emit: jest.fn(),
  };
  mockedSocket3 = {
    id: mockedSocket3Id,
    leave: jest.fn(),
    to: jest.fn(() => mockedSocket3),
    emit: jest.fn(),
  };
  mockedSocket4 = {
    id: mockedSocket4Id,
    leave: jest.fn(),
    to: jest.fn(() => mockedSocket3),
    emit: jest.fn(),
  };

  // Creates mocked io
  mockedIO = {
    to: jest.fn(() => mockedIO),
    emit: jest.fn(),
  };

  // Creates a mocked room with one user on team A
  mockedRoom = {
    teamNumberOfPlayers: 2,
    roundTime: 120,
    roundsToPlay: 4,
    _id: roomId,
    createdBy: mockedUserInfo.username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teamAPlayers: new Set(),
    teamBPlayers: new Set(),
    teamAPoints: 0,
    teamBPoints: 0,
    wordGuessed: false,
    stealWord: false,
    currentWord: 'wordTest',
    currentTeam: 'teamAPlayers',
    wordsHistory: [],
    currentPlayer: mockedSocket3Id,
    finishedTurns: 0,
    hinted: true,
  };

  // Adding players to the teams
  mockedRoom.teamAPlayers.add(mockedSocket1.id);
  mockedRoom.teamAPlayers.add(mockedSocket2.id);
  mockedRoom.teamBPlayers.add(mockedSocket3.id);

  rooms.set(mockedRoom._id, mockedRoom);
  onlineUsers.set(mockedSocket1Id, mockedUserInfo);
  onlineUsers.set(mockedSocket2Id, mockedUserInfo);
  onlineUsers.set(mockedSocket3Id, mockedUserInfo);
});

afterEach(() => {
  onlineUsers.clear();
  rooms.clear();
});

afterAll(async () => {
  server.close();
});

describe('Test disconnect callback', () => {
  it('Should disconnect user from room and online users', () => {
    const disconnectHandler = disconnect(mockedSocket1);
    disconnectHandler();

    // Expect socket to be called with corresponding methods
    expect(mockedSocket1.to).toHaveBeenCalledWith(mockedUserInfo.roomId);
    expect(mockedSocket1.emit).toHaveBeenCalledWith(
      'user-left',
      `${mockedUserInfo.username} has left the room`
    );
    expect(mockedSocket1.leave).toHaveBeenCalledWith(mockedUserInfo.roomId);

    // Expect socket to be deleted from online users
    expect(onlineUsers.has(mockedSocket1.id)).toBeFalsy();
    // Expect socket to be deleted from his team
    expect(rooms.get(roomId)?.teamAPlayers.has(mockedSocket1.id)).toBeFalsy();
  });

  it('Should disconnect user if in teamB', () => {
    const disconnectHandler = disconnect(mockedSocket3);
    disconnectHandler();

    expect(onlineUsers.has(mockedSocket3.id)).toBeFalsy();
  });
});

describe('Test guessWord callback', () => {
  it('Should guess the correct word and add one point to teamA if correct team A player is playing', () => {
    const word = { word: mockedRoom.currentWord };
    const guessWordHandler = guessWord(mockedSocket2, mockedIO);
    guessWordHandler(word);

    // Expect io to be called with corresponding methods
    // if correct team is playing
    expect(mockedIO.to).toHaveBeenCalledWith(mockedUserInfo.roomId);
    expect(mockedIO.emit).toHaveBeenCalledWith(
      'correct-guess',
      `${mockedUserInfo.username} guessed ${word.word} correctly!`
    );
    expect(mockedIO.emit).toHaveBeenCalledWith(
      'correct-guess',
      `${mockedUserInfo.username} guessed ${word.word} correctly!`
    );
    expect(mockedIO.emit).toHaveBeenCalledWith(
      'new-word-sent-to',
      `New word sent to ${mockedUserInfo.username} from team teamAPlayers`
    );

    // Expect the team to score 1 point
    expect(mockedRoom.teamAPoints).toBe(1);
  });

  it('Should should not score a point if team A turn but team B try to guess', () => {
    const word = { word: mockedRoom.currentWord };
    const guessWordHandler = guessWord(mockedSocket3, mockedIO);
    guessWordHandler(word);

    // Expect io to be called with corresponding methods
    expect(mockedIO.to).not.toHaveBeenCalled();

    // Expect the teams to not score points
    expect(mockedRoom.teamBPoints).toBe(0);
    expect(mockedRoom.teamBPoints).toBe(0);
  });
});

describe('Testing sendHint callback', () => {
  it('Should send hint if current player is the word owner', async () => {
    const sendHintHandler = sendHint(mockedSocket3, mockedIO);
    const hint = { hint: 'someHint a' };
    sendHintHandler(hint);

    expect(mockedIO.to).toHaveBeenCalledWith(mockedUserInfo.roomId);
    expect(mockedIO.emit).toHaveBeenCalledWith(
      'show-hint',
      `${mockedUserInfo.username} hinted: ${hint.hint}`
    );
  });

  it('Should not send hint if current player sends the word', async () => {
    const sendHintHandler = sendHint(mockedSocket3, mockedIO);
    const hint = { hint: mockedRoom.currentWord };
    sendHintHandler(hint);

    expect(mockedIO.to).not.toHaveBeenCalled();
    expect(mockedIO.emit).not.toHaveBeenCalled();
  });

  it('Should not send hint if current player is not the word owner', async () => {
    const sendHintHandler = sendHint(mockedSocket1, mockedIO);
    const hint = { hint: 'someHint a' };
    sendHintHandler(hint);

    expect(mockedIO.to).not.toHaveBeenCalled();
    expect(mockedIO.emit).not.toHaveBeenCalled();
  });
});

describe('Testing playerReady callback', () => {
  it('Should set a player as ready into teamA', async () => {
    // Create user and store into db
    const user = {
      email: mockedUserInfo.username,
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

    // Create room
    const roomToCreate = {
      teamNumberOfPlayers: mockedRoom.teamNumberOfPlayers,
      roundTime: mockedRoom.roundTime,
      roundsToPlay: mockedRoom.roundsToPlay,
    };
    const createdRoomRes = await request(server)
      .post('/room')
      .send(roomToCreate)
      .set('Authorization', `Bearer: ${loginUserRes.body.token}`)
      .expect(201);

    // update mockedRoom id to match one stored in db
    mockedRoom._id = createdRoomRes.body._id;
    mockedUserInfo.roomId = createdRoomRes.body._id;

    // join user to room
    await request(server)
      .patch(`/room/${mockedUserInfo.roomId}`)
      .set('Authorization', `Bearer: ${loginUserRes.body.token}`)
      .send({ team: 'teamA' })
      .expect(200);

    const playerReadyHandler = playerReady(mockedSocket1);
    await playerReadyHandler();

    expect(mockedSocket1.join).toHaveBeenCalledWith(mockedUserInfo.roomId);
    expect(mockedSocket1.to).toHaveBeenCalledWith(mockedUserInfo.roomId);
    expect(mockedSocket1.emit).toHaveBeenCalledWith(
      'new-room-join',
      `${mockedUserInfo.username} has joined the room.`
    );
  });

  it('Should not set a player as ready if he did not join to a match', async () => {
    const playerReadyHandler = playerReady(mockedSocket2);
    await playerReadyHandler();

    expect(mockedSocket1.to).not.toHaveBeenCalled();
    expect(mockedSocket1.emit).not.toHaveBeenCalled();
  });
});

describe('Testing startGame callback', () => {
  it('Should not start the game if there are not enough players', () => {
    const startGameHandler = startGame(mockedSocket1, mockedIO);
    startGameHandler({ roomId });
    expect(mockedIO.emit).not.toHaveBeenCalled();
    expect(mockedIO.to).not.toHaveBeenCalled();
    expect(mockedSocket1.emit).toHaveBeenCalledWith(
      'error',
      '{"error":{"status":400,"message":"Not enough players"}}'
    );
    expect(mockedSocket1.to).not.toHaveBeenCalled();
  });

  it('Should start the game if all players are join', () => {
    // Adding missing player to teamB
    mockedRoom.teamBPlayers.add(mockedSocket4.id);
    const startGameHandler = startGame(mockedSocket1, mockedIO);

    startGameHandler({ roomId });
    expect(mockedIO.to).toHaveBeenCalledWith(mockedUserInfo.roomId);
    expect(mockedIO.emit).toHaveBeenCalledWith(
      'new-word-sent-to',
      `New word sent to ${mockedUserInfo.username} from team teamBPlayers`
    );

    const clock = sinon.useFakeTimers();

    clock.tick(mockedRoom.roundTime * 1000);
    expect(mockedSocket1.to).toHaveBeenCalledWith(mockedUserInfo.roomId);
    // Called one time for announcing another team plays, another time for
    // sending new word
    expect(mockedSocket1.emit).toHaveBeenCalledTimes(2);

  });
});
