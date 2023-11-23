import { registerUserService, loginUserService } from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { UserDto } from "../dtos/UserDto";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  try {
    const { email, password } = req.body;
    const token = await loginUserService(email, password);
    return res.json({ token });
  } catch (error) {
    next(error);
  }
};
