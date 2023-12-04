import { CustomError } from '../../helpers/CustomError';

describe('CustomError', () => {
  it('should create an instance of CustomError with default values if no arguments are provided', () => {
    const error = new CustomError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe('Unexpected error');
    expect(error.status).toBe(500);
  });

  it('should create an instance of CustomError with provided message and status', () => {
    const errorMessage = 'Custom error message';
    const statusCode = 404;
    const error = new CustomError(errorMessage, statusCode);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(statusCode);
  });

  it('should create an instance of CustomError with default message if message is not provided', () => {
    const statusCode = 403;
    const error = new CustomError(undefined, statusCode);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe('Unexpected error');
    expect(error.status).toBe(statusCode);
  });

  it('should create an instance of CustomError with default status if status is not provided', () => {
    const errorMessage = 'Custom error message';
    const error = new CustomError(errorMessage);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(errorMessage);
    expect(error.status).toBe(500);
  });
});
