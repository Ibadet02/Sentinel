import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./config";
import issueRouter from "./routes/issue.routes";
import commentRouter from "./routes/comment.routes";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/issues", issueRouter);
app.use("/comments", commentRouter);
app.use("/auth", authRouter);
app.use(errorHandler);
