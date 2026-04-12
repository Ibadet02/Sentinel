import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});
