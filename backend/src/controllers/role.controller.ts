import {Request , Response} from "express";
import Role from "../models/Role";
import Permission from "../models/Permission";

export const getAllRoles=async(req: Request , res: Response)=>{
    try{
        const roles = await Role.find().populate({
            path : "permissions",
            select : "name"
        });
        res.status(200).json({roles});
    }
    catch(err){
        res.status(500).json({ message: "Error fetching roles: " + err?.message });
    }
}