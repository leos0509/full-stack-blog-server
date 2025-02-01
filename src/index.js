import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import { connectDB } from "./lib/db.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
dotenv.config();
connectDB();

import userRoutes from "./routes/user.route.js";
import commentRoutes from "./routes/comment.route.js";
import postRoutes from "./routes/post.route.js";
import webhookRoutes from "./routes/webhook.route.js";

// Constants
const PORT = process.env.PORT || 3000;


app.use(clerkMiddleware());
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Example Node.js Express setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
