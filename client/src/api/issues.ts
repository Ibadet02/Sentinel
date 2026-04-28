import { apiClient } from "./client";
import type { Issue } from "@sentinel/shared";

export const getAllIssues = async () => {
  const response = await apiClient.get<Issue[]>("/issues");

  return response.data;
};

export const createIssue = async (data: {
  title: string;
  description?: string;
}) => {
  const response = await apiClient.post<Issue>("/issues", data);

  return response.data;
};

export const deleteIssue = async (id: number) => {
  await apiClient.delete(`/issues/${id}`);
};

export const updateIssue = async (
  id: number,
  data: { title?: string; description?: string; status?: string }
) => {
  const response = await apiClient.patch(`/issues/${id}`, data);

  return response.data;
};
