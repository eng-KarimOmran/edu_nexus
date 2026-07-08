import env from "./config/env";
import { notFoundRouter } from "./shared/middlewares/notfound.middleware";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./shared/middlewares/errors.middleware";
import router from "./index.routes";
import compression from "compression"
import path from "path"
import helmet from "helmet"
import hpp from "hpp"

import { rateLimit } from 'express-rate-limit'

const app: Application = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(cors({
  origin: env.app.corsOrigins.split(","),
  credentials: true,
}));

app.use(compression());

app.use(express.json({
  limit: "100kb",
}));

app.use(cookieParser());

app.use(hpp());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "لاحظنا استخدام غير طبيعي حاول في وقت آخر",
    },
  })
);

app.use("/api/v1", router);

const clientPath = path.resolve(process.cwd(), "./client/dist");

app.use(express.static(clientPath));

app.get("/{*path}", (_, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.use(notFoundRouter);

app.use(globalErrorHandler);

export default app;