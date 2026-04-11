import "./config";
import express from "express";
import issueRouter from "./routes/issue.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/issues", issueRouter);
app.use(errorHandler);
