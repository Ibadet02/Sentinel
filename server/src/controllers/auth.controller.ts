import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import * as authService from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  const userData = signupSchema.parse(req.body);
  const signupUser = await authService.signup(userData);

  res.status(201).json(signupUser);
};

export const login = async (req: Request, res: Response) => {
  const userData = loginSchema.parse(req.body);
  const loginUser = await authService.login(userData);

  res.json(loginUser);
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
