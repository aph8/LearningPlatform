import express, { Request, Response } from "express";
import morgan from "morgan";
import loginRoutes from "./routes/loginRoutes";
import signupRoutes from "./routes/signupRoutes";
import userRoutes from "./routes/userRoutes";
import studentRoutes from "./routes/studentRoutes";
import courseRoutes from "./routes/courseRoutes";
import assignmentRoutes from "./routes/assignmentRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import dotenv from "dotenv";
import cors from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const app = express();
dotenv.config();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(morgan("dev"));

app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err: unknown, req: Request, res: Response) => {
  if (err instanceof Error) {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default app;
