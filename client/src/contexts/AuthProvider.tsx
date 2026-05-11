import { useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import type { LoginInput, SignupInput, User } from "@sentinel/shared";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .getMe()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const signup = async (data: SignupInput) => {
    const { user } = await authApi.signup(data);

    setUser(user);
  };

  const login = async (data: LoginInput) => {
    const { user } = await authApi.login(data);

    setUser(user);
  };

  const logout = async () => {
    await authApi.logout();

    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
