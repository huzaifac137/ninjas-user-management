import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../interfaces";
import User from "../models/User";

interface UserPayload {
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      dbUser?: IUser
      user?: UserPayload;
    }
  }
}

export const verifyToken =async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
   const decoded = await Jwt.verify(token, process.env.JWT_SEC);
      const user = decoded as UserPayload;
      const dbUser = await User.findById(user._id).populate({
        path : "role",
        select : "name"
      });
      
      if(!dbUser){
        res.status(404).json({message : "User not found"});
        return;
      }
      req.user = user;
      req.dbUser = dbUser;
      next();
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied Invalid Token" });
    return;
  }
      
} catch (error) {
     res.status(500).json({message : "Error : " + error.message});
}
};
