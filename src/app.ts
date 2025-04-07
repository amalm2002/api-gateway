import compression from "compression";
import express, { Application } from "express";
import helmet from "helmet";
import cors from 'cors';
import logger from "morgan";
import http from 'http';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import userRoute from "./modules/user/route";
import resturantRoute from "./modules/restaurant/route"
import authRoute from "./modules/auth/route"
import adminRoute from "./modules/admin/route";

class App {
  public app: Application;
  public server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.applyMiddleware();
    this.routes();
  }

  private applyMiddleware(): void {
    this.app.use(express.json({ limit: '50mb' }));

    this.app.use(cors({
      origin: process.env.CORS_ORGIN,
      credentials: true,
    }));

    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(logger('dev'));
    this.app.use(cookieParser());
  }

  private routes(): void {
    this.app.use("/api/user", userRoute);
    this.app.use("/api/restaurant", resturantRoute);
    this.app.use('/api/auth',authRoute)
    this.app.use('/api/admin',adminRoute)
  }

  public startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`API-Gateway started on ${port}`);
    });
  }
}

export default App;





