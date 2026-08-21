import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { attachSession } from "./middleware/auth";
import { authRouter } from "./routes/auth";
import { buyerProfileRouter } from "./routes/buyerProfile";
import { assetsRouter } from "./routes/assets";
import { buyersRouter } from "./routes/buyers";
import { sellersRouter } from "./routes/sellers";
import { managerRouter } from "./routes/manager";
import { contactsRouter } from "./routes/contacts";
import { matchRouter } from "./routes/match";
import { publicRouter } from "./routes/public";
import { favoritesRouter } from "./routes/favorites";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.WEB_ORIGIN?.split(",") ?? true,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(attachSession);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/buyer/profile", buyerProfileRouter);
  app.use("/api/assets", assetsRouter);
  app.use("/api/buyers", buyersRouter);
  app.use("/api/sellers", sellersRouter);
  app.use("/api/manager", managerRouter);
  app.use("/api/contacts", contactsRouter);
  app.use("/api/match", matchRouter);
  app.use("/api/public", publicRouter);
  app.use("/api/favorites", favoritesRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}
