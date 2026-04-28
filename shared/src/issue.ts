export const ISSUE_STATUSES = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;
export type IssueStatus = typeof ISSUE_STATUSES[number]

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
}
