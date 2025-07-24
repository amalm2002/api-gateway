import compression from "compression";
import express, { Application } from "express";
import helmet from "helmet";
import cors from 'cors';
import logger from "morgan";
import http from 'http';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { publicRoute, protectedRoute } from "./modules/user/route";
import { publicRestaurantRoute, protectedRestaurantRoute } from "./modules/restaurant/route"
import authRoute from "./modules/auth/route"
import adminRoute from "./modules/admin/route";
import {deliveryBoyPublicRoute,deliveryBoyProtectedRoute} from "./modules/deliveryBoy/route";
import { isValidated } from "./modules/auth/controller";
import { setupSocketIO } from "./modules/socket/socket";
import { morganMiddleware } from "./middleware/centerlized-logging";
import { generalRateLimiter } from "./middleware/rateLimiter";

class App {
  public app: Application;
  public server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.applyMiddleware();
    this.routes();
    setupSocketIO(this.server);
  }

  private applyMiddleware(): void {
    this.app.use(morganMiddleware)
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(cors({
      origin: process.env.CORS_ORGIN,
      credentials: true,
    }));

    this.app.use(compression());
    this.app.use(helmet());
    // this.app.use(logger('dev'));
    this.app.use(cookieParser());
    this.app.use(generalRateLimiter)
  }

  private routes(): void {
    //public route   
    this.app.use("/api/user", publicRoute);
    this.app.use("/api/restaurant", publicRestaurantRoute);
    this.app.use('/api/deliveryBoy', deliveryBoyPublicRoute)

    //protected route 
    this.app.use('/api/auth', authRoute)
    this.app.use("/api/user", isValidated('User'), protectedRoute);
    this.app.use("/api/restaurant", isValidated('Restaurant'), protectedRestaurantRoute);
    this.app.use('/api/admin', isValidated('Admin'), adminRoute)
    this.app.use('/api/deliveryBoy', isValidated('DeliveryBoy'), deliveryBoyProtectedRoute)
  }

  public startServer(port: number): void {
    this.server.listen(port, () => {
      console.log(`API-Gateway started on ${port}`);   
    });
  }
}

export default App;





