import "express-session";
import { User } from "src/user/user.entity";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    requester: User;
  }
}
