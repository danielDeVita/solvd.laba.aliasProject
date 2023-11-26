import { Socket } from 'socket.io';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { rooms } from '../../repositories/inMemory/rooms';

// Handle disconnection of a user
export const disconnect = (socket: Socket) => {

  return () => {

    // gets user information
    const user = onlineUsers.get(socket.id);
    
    if (user) {
      // send message to everyone that user left the room
      socket
        .to(user.roomId)
        .emit('user-left', `${user.username} has left the room`);
      socket.leave(user.roomId);
      onlineUsers.delete(socket.id);

      // Obtain roomId from the the user information
      const gameState = rooms.get(user.roomId);
      if (gameState) {
        // Delete user from the gameRoom in the team he is playing
        if ( socket.id in gameState.teamAPlayers)
          gameState.teamAPlayers.delete(socket.id);
        else 
          gameState.teamBPlayers.delete(socket.id);
        rooms.set(user.roomId, gameState);
      }      
    }
  };

};
