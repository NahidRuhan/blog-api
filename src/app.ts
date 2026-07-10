import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/posts/post.route";
import { commentRoutes } from "./modules/comments/comment.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { subscriptionRoute } from "./modules/subscription/subscription.route";
import { premiumRoute } from "./modules/premium/premium.route";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/subscription/webhook",express.raw({type:"application/json"}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Blog API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      auth: "/api/auth",
      posts: "/api/posts",
      comments: "/api/comments",
      subscription: "/api/subscription",
      premium: "/api/premium"
    }
  });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/subscription", subscriptionRoute);
app.use("/api/premium", premiumRoute);


app.use(notFound);

app.use(globalErrorHandler);

export default app;
