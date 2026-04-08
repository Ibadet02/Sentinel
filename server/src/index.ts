import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 3000;

const app = express();
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/issues", async (req, res) => {
  const issue = await prisma.issue.create({
    data: {
      title: req.body.title,
      description: req.body.description,
    },
  });

  res.status(201).json(issue);
});

app.get("/issues", async (_, res) => {
  const issues = await prisma.issue.findMany();

  res.json(issues);
});

app.get("/issues/:id", async (req, res) => {
  const issue = await prisma.issue.findUnique({
    where: { id: Number(req.params.id) },
  });

  if (!issue) {
    res.status(404).json({ error: "Issue not found" });
    return;
  }

  res.json(issue);
});

app.patch("/issues/:id", async (req, res) => {
  try {
    const updatedIssue = await prisma.issue.update({
      where: { id: Number(req.params.id) },
      data: { ...req.body },
    });

    res.json(updatedIssue);
  } catch (err) {
    res.status(404).json({ error: "No issue to update" });
  }
});

app.delete("/issues/:id", async (req, res) => {
  try {
    await prisma.issue.delete({
      where: { id: Number(req.params.id) },
    });

    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: "No issue to delete" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
