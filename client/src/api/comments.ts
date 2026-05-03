import type { Comment } from "@sentinel/shared";
import { apiClient } from "./client";

export const getCommentsForIssue = async (issueId: number) => {
  const response = await apiClient.get<Comment[]>(`/issues/${issueId}/comments`);

  return response.data;
};

export const createComment = async (
  issueId: number,
  data: {
    content: string;
  }
) => {
  const response = await apiClient.post<Comment>(`/issues/${issueId}/comments`, data);

  return response.data;
};

export const updateComment = async (
  id: number,
  data: {
    content: string;
  }
) => {
  const response = await apiClient.patch(`/comments/${id}`, data);

  return response.data;
};

export const deleteComment = async (id: number) => {
  await apiClient.delete(`/comments/${id}`);
};
