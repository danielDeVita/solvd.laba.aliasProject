import { Socket } from 'socket.io';
import { onlineUsers } from '../../repositories/inMemory/onlineUsers';
import { rooms } from '../../repositories/inMemory/rooms';

// Handle disconnection of a user
export const disconnect = (socket: Socket) => {

  return () => {

    // gets user information
    const user = onlineUsers.get(socket.id);
    
    if (user) {
      // Obtain roomId from the the user information
      const gameState = rooms.get(user.roomId);
      if (gameState) {
        console.log(socket.id);
        // Delete user from the gameRoom in the team he is playing
        if ( gameState.teamAPlayers.has(socket.id)) { 
          gameState.teamAPlayers.delete(socket.id);
        } else { 
          gameState.teamBPlayers.delete(socket.id);
        }
        rooms.set(user.roomId, gameState);
      } 
      
      // send message to everyone that user left the room
      socket
        .to(user.roomId)
        .emit('user-left', `${user.username} has left the room`);
      socket.leave(user.roomId);
      onlineUsers.delete(socket.id);
    }
  };

};
