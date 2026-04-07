import express from "express";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

app.get("/issues", async (req, res) => {
  const issues = await prisma.issue.findMany();

  res.json(issues);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
