import { apiClient } from "./client";
import type { Issue } from "@sentinel/shared";

export const getAllIssues = async () => {
  const response = await apiClient.get<Issue[]>("/issues");

  return response.data;
};
