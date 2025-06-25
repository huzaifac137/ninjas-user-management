import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).json({message : errors.array()[0].msg });
    return;
  }
  next();
};
