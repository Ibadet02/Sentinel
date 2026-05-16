import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { createToken } from "../auth/jwt";
import { AuthError } from "../error";

const SALT_ROUNDS = 10;

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const { email, password, name } = data;
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });
  const token = createToken(user.id);
  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const login = async (data: { email: string; password: string }) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new AuthError();

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) throw new AuthError;

  const token = createToken(user.id);
  const { passwordHash: _, ...safeUser } = user;

  return { user: safeUser, token };
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  const { passwordHash: _, ...safeUser } = user;

  return safeUser;
};
