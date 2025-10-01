import type { Request as ExpressRequest } from "express";
import { User } from "../user/user.entity";

declare global {
  interface Request extends ExpressRequest {
    userEntity?: User;
  }
}
