import { registerUserService, loginUserService } from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { UserDto } from "../dtos/UserDto";
import { validationResult } from "express-validator";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const userData: UserDto = req.body;
    const user = await registerUserService(userData);
    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const { email, password } = req.body;
    const token = await loginUserService(email, password);
    return res.json({ token });
  } catch (error) {
    next(error);
  }
};
