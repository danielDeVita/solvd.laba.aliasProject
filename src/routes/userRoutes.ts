import express from "express";
import { registerUser, loginUser } from "../controllers/userController";
import {
  validateUserCreation,
  valdateUserLogin,
} from "../middlewares/UserValidator/userValidator";

const userRouter = express.Router();

userRouter.post("/register", validateUserCreation, registerUser);
userRouter.post("/login", valdateUserLogin, loginUser);

export default userRouter;
