/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../helpers/CustomError';
import 'dotenv/config';

/**
 * Handle error thrown by other middleware. It responses
 * to client with the error status and the error message
 * @param error The error object
 * @param req The request
 * @param res The response
 * @param next The next function
 */
const expressErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let message;
  if (process.env.NODE_ENV == 'dev') {
    // If in dev environment, expose critical information
    message = {
      error: {
        status: error.status || 422,
        message: error.message,
        stack: error.stack,
        body: req.body,
        headers: req.headers,
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
    res.status(error.status).json(message);
  } else {
    // Error thrown by library o internal server error
    res
      .status(message.error.status)
      .json({ ...message, detailedError: { ...(error as CustomError) } });
  }
};

export { expressErrorHandler };
