import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import * as authService from "../services/auth.service";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const signup = async (req: Request, res: Response) => {
  const userData = signupSchema.parse(req.body);
  const { user, token } = await authService.signup(userData);

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const userData = loginSchema.parse(req.body);
  const { user, token } = await authService.login(userData);

  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({ user });
};

export const logout = async (_: Request, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(204).send();
};

export const me = async (req: Request, res: Response) => {
  res.json(req.user);
};
