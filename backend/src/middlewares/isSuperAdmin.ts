import { NextFunction, Request , Response } from "express"
import User from "../models/User";
import { IRole } from "../interfaces";

export const isSuperAdmin=async(req: Request , res: Response , next: NextFunction )=>{
    try {
          const user = req.dbUser;
          const role = user?.role as IRole;
          if(role?.name !== "super_admin"){
            res.status(403).json({message : "Forbidden : You are not authorized to perform this action"});
            return;
          }
          req.dbUser=user;
          next();
    } catch (error) {
         res.status(500).json({message : "Error : " + error.message});
    }
}