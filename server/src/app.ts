import express from "express";
import cors from "cors";
import "./config";
import issueRouter from "./routes/issue.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/issues", issueRouter);
app.use(errorHandler);
