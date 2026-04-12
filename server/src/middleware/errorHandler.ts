import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { z } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ error: "Record not found" });
      return;
    }
  }

  if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.issues });
    return;
  }

  console.error(err);

  res.status(500).json({ error: "Internal server error" });
};
