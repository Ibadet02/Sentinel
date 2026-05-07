import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwt";
import { getUserById } from "../services/auth.service";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
