import { Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { CustomError } from '../../helpers/CustomError';
import { DecodedToken } from '../../interfaces/IDecodedToken';

export const authenticateToken = (
  //I didn't know what type to define on req without messing the code once I add 'user' to the req
  req: any,
  _res: Response,
  next: NextFunction
) => {
  //grabs token from header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return next(new CustomError('Unauthorized: Missing token', 401));
  }

  jwt.verify(
    token,
    `${process.env.JWT_SECRET}`,
    (err: VerifyErrors | null, decoded: any | undefined) => {
      if (err) {
        return next(new CustomError('Forbidden: Invalid token', 403));
      }

      const decodedToken = decoded as DecodedToken;

      req.user = decodedToken;
      req.headers.userId = decodedToken.email;
      req.headers.userRole = decodedToken.role;

      next();
    }
  );
};
