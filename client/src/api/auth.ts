import type {
  AuthResponse,
  LoginInput,
  SignupInput,
  User,
} from "@sentinel/shared";
import { apiClient } from "./client";

export const signup = async (data: SignupInput) => {
  const response = await apiClient.post<AuthResponse>("/auth/signup", data);

  return response.data;
};

export const login = async (data: LoginInput) => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);

  return response.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout");
};

export const getMe = async () => {
  const response = await apiClient.get<User>("/auth/me");

  return response.data;
};
