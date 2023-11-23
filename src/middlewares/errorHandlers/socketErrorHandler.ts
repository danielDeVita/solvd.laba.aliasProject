import { CustomError } from '../../helpers/CustomError';
import { Socket } from 'socket.io';
import 'dotenv/config';

/**
 * Handle error thrown during a socket communication.
 * It emits to client with the error status and the error message
 * under the 'error' event
 * @param socket
 * @param error
 */
const socketErrorHandler = (socket: Socket, error: CustomError): void => {
  let message;
  if (process.env.NODE_ENV == 'dev') {
    // If in dev environment, expose critical information
    message = {
      error: {
        status: error.status || 422,
        message: error.message,
        stack: error.stack,
      },
    };
  } else {
    // If in production environment, not expose critical information
    message = {
      error: {
        status: error.status || 422,
        message: error.message,
      },
    };
  }

  if (error instanceof CustomError) {
    // Error thrown in purpose by developer
    socket.emit('error', JSON.stringify(message));
  } else {
    // Error thrown by library o internal server error
    socket.emit(
      JSON.stringify({
        ...message,
        detailedError: { ...(error as CustomError) },
      })
    );
  }
};

export { socketErrorHandler };
