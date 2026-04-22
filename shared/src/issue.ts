export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
}