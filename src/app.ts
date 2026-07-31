import env from "./config/env";
import { notFoundRouter } from "./shared/middlewares/notfound.middleware";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./shared/middlewares/errors.middleware";
import router from "./index.routes";
import compression from "compression"
import helmet from "helmet"
import hpp from "hpp"

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

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.redirect(301, "https://royalblue-mole-560764.hostingersite.com/");
});

app.use(notFoundRouter);
app.use(globalErrorHandler);

export default app;
