export class CustomError extends Error {
  status: number;

  /**
   * Class used for creating custom error.
   * It can be used to pass it to a express middleware error
   * handler "next(new CustomError(message, statusCode))".
   * It can be used for emitting a error while in a socket
   * communication "socketErrorHandler(socket, new CustomError(message, statusCode))"
   * @param message The error message
   * @param status The error status code
   */
  constructor(message: string, status: number) {
    super(message || 'Unexpected error');
    this.status = status || 500;
  }
}
