/* eslint-disable @typescript-eslint/no-explicit-any */
import { onlineUsers } from '../repositories/inMemory/onlineUsers';
import { GameState } from '../interfaces/GameInterfaces';
import { disconnect } from '../services/game/disconnect';
import { rooms } from '../repositories/inMemory/rooms';
import { guessWord } from '../services/game/guessWord';
import { sendHint } from '../services/game/sendHint';

// Creating mocked socket
const mockedSocket1Id = 'someSockedId1';
const mockedSocket2Id = 'someSockedId2';
const mockedSocket3Id = 'someSockedId3';
const mockedSocket4Id = 'someSockedId4';

const roomId = 'someRoomId';
const mockedUserInfo = {
  username: 'someUserName',
  roomId: roomId,
};
let mockedSocket1: any;
let mockedSocket2: any;
let mockedSocket3: any;
let mockedSocket4: any;

let mockedIO: any;

// Creating mocked Room
let mockedRoom: GameState;

beforeEach(async () => {
  // Creates mocked sockets
  mockedSocket1 = {
    id: mockedSocket1Id,
    leave: jest.fn(),
    to: jest.fn(() => mockedSocket1),
    emit: jest.fn(),
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
  };

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
