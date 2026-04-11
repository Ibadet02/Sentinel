import "./config";
import express from "express";
import issueRouter from "./routes/issue.routes";
import { errorHandler } from "./middleware/errorHandler";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/issues", issueRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
