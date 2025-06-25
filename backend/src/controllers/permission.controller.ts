import {Request , Response} from "express";
import Permission from "../models/Permission";

export const getAllPermissions=async(req: Request , res: Response)=>{
    try{
        const permissions = await Permission.find();
        res.status(200).json({permissions});
    }
    catch(err){
        res.status(500).json({ message: "Error fetching permissions: " + err?.message });
    }
}