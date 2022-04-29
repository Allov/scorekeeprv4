import { Request, Response } from "express";
import { User } from "./users/user.types";

export interface ScorekeeprContext {
  user: User,
  req: Request,
  res: Response
}
