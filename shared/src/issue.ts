export const ISSUE_STATUSES = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export interface Author {
  id: number;
  name: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  userId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  issueId: number;
  userId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
}
