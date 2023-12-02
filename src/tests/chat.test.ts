import { disconnect } from '../services/chat/disconnect';
import { joinRoom } from '../services/chat/joinRoom';
import { leaveRoom } from '../services/chat/leaveRoom';
import { sendMessage } from '../services/chat/sendMessage';
import { onlineUsers } from '../repositories/inMemory/onlineUsers';
import { IIncomingSocketMessage } from '../interfaces/IChatMessage';
import ChatMessageService from '../services/chatMessageService';

const mockSocketId = 'mockSocketId';
const mockUserInfo = {
  username: 'mockUsername',
  roomId: 'mockRoomId'
};
const ROOM_SUFFIX = 'chatRoom';

describe('disconnect function', () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      id: mockSocketId,
      to: jest.fn(() => mockSocket),
      emit: jest.fn()
    };

    onlineUsers.set(mockSocketId, mockUserInfo);
  });

  afterEach(() => {
    onlineUsers.clear();
  });

  it('should emit a message to the room about user leaving', () => {
    const disconnectHandler = disconnect(mockSocket);
    disconnectHandler();

    expect(mockSocket.to).toHaveBeenCalledWith(mockUserInfo.roomId + ROOM_SUFFIX);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message',
      `${mockUserInfo.username} has left the chat room.`
    );
  });

  it('should not emit a message if user information is not available', () => {
    onlineUsers.clear(); // Clear user information

    const disconnectHandler = disconnect(mockSocket);
    disconnectHandler();

    expect(mockSocket.to).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});

describe('joinRoom function', () => {
  let mockSocket: any; 

  beforeEach(() => {
    mockSocket = {
      id: mockSocketId,
      join: jest.fn(),
      to: jest.fn(() => mockSocket),
      emit: jest.fn()
    };

    onlineUsers.set(mockSocketId, mockUserInfo);
  });

  afterEach(() => {
    onlineUsers.clear();
  });

  it('should join the user to the room and emit a message about user joining', () => {
    const joinRoomHandler = joinRoom(mockSocket);
    joinRoomHandler();

    expect(mockSocket.join).toHaveBeenCalledWith(mockUserInfo.roomId + ROOM_SUFFIX);
    expect(mockSocket.to).toHaveBeenCalledWith(mockUserInfo.roomId + ROOM_SUFFIX);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message',
      `${mockUserInfo.username} has joined the chat room.`
    );
  });

  it('should not join the room or emit a message if user information is not available', () => {
    onlineUsers.clear(); // Clear user information

    const joinRoomHandler = joinRoom(mockSocket);
    joinRoomHandler();

    expect(mockSocket.join).not.toHaveBeenCalled();
    expect(mockSocket.to).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});

describe('leaveRoom function', () => {
  let mockSocket: any;

  beforeEach(() => {
    mockSocket = {
      id: mockSocketId,
      leave: jest.fn(),
      to: jest.fn(() => mockSocket),
      emit: jest.fn()
    };

    onlineUsers.set(mockSocketId, mockUserInfo);
  });

  afterEach(() => {
    onlineUsers.clear();
  });

  it('should leave the user from the room and emit a message about user leaving', () => {
    const leaveRoomHandler = leaveRoom(mockSocket);
    leaveRoomHandler();

    expect(mockSocket.leave).toHaveBeenCalledWith(mockUserInfo.roomId + ROOM_SUFFIX);
    expect(mockSocket.to).toHaveBeenCalledWith(mockUserInfo.roomId + ROOM_SUFFIX);
    expect(mockSocket.emit).toHaveBeenCalledWith(
      'message',
      `${mockUserInfo.username} has left the chat room.`
    );
  });

  it('should not leave the room or emit a message if user information is not available', () => {
    onlineUsers.clear(); // Clear user information

    const leaveRoomHandler = leaveRoom(mockSocket);
    leaveRoomHandler();

    expect(mockSocket.leave).not.toHaveBeenCalled();
    expect(mockSocket.to).not.toHaveBeenCalled();
    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});

jest.mock('../services/chatMessageService');

const mockSocket = {
  id: mockSocketId,
  rooms: new Set([mockUserInfo.roomId + ROOM_SUFFIX]),
  emit: jest.fn(),
};

const mockIO: any = {
  to: jest.fn(() => mockIO),
  emit: jest.fn(),
};

describe('sendMessage function', () => {
  beforeEach(() => {
    onlineUsers.set(mockSocketId, mockUserInfo);
  });

  afterEach(() => {
    onlineUsers.clear();
    jest.clearAllMocks();
  });

  it('should send a message to the chat room and persist it', async () => {
    const mockMessage: IIncomingSocketMessage = {
      message: 'Test message',
    };

    await sendMessage(mockSocket as any, mockIO as any)(mockMessage);

    expect(ChatMessageService.create).toHaveBeenCalledWith(expect.any(Object));
    expect(mockIO.to).toHaveBeenCalledWith(mockUserInfo.roomId + ROOM_SUFFIX);
    expect(mockIO.emit).toHaveBeenCalledWith('chat message', expect.any(Object));
  });

  it('should not send a message if user or room information is not available', async () => {
    onlineUsers.clear(); // Clear user information

    const mockMessage: IIncomingSocketMessage = {
      message: 'Test message',
    };

    await sendMessage(mockSocket as any, mockIO as any)(mockMessage);

    expect(ChatMessageService.create).not.toHaveBeenCalled();
    expect(mockIO.to).not.toHaveBeenCalled();
    expect(mockIO.emit).not.toHaveBeenCalled();
  });
});