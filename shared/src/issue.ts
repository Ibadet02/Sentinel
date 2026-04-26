export const ISSUE_STASUSES = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;
export type IssueStatus = typeof ISSUE_STASUSES[number]

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
}
