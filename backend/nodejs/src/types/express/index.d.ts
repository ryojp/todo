import { Request } from "express";

declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      username?: string;
    }
  }
}
