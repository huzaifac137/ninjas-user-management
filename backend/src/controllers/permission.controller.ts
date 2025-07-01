import {Request , Response} from "express";
import Permission from "../models/Permission";
import mongoose from "mongoose";
import Role from "../models/Role";

export const getAllPermissions=async(req: Request , res: Response)=>{
    try{
        const permissions = await Permission.find();
        res.status(200).json({permissions});
    }
    catch(err){
        res.status(500).json({ message: "Error fetching permissions: " + err?.message });
    }
}

export const createPermission=async(req: Request , res: Response)=>{
    try{
        const {name} = req.body;
        const permissionExists = await Permission.findOne({name});
        if(permissionExists){
            res.status(400).json({ message: "Permission already exists" });
            return;
        }
        const permission = await Permission.create({name});
        
        res.status(200).json({permission , message : "Permission created successfully"});
    }
    catch(err){
        res.status(500).json({ message: "Error creating permission: " + err?.message });
    }
}

export const deletePermissionFromApp=async(req: Request , res: Response)=>{
    try {
        const {permissionId} = req.params;
        const permission = await Permission.findById(permissionId);
        if(!permission){
            res.status(400).json({ message: "Permission not found" });
            return;
        }

        const rolesWithThisPermission = await Role.find({permissions: {
            $in: [permissionId]
        }});

        if(rolesWithThisPermission.length > 0){
            res.status(400).json({ message: "Cannot delete permission. It is assigned to one or more roles." });
            return;
        }

        await permission.deleteOne();
        res.status(200).json({ message: "Permission deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting permission: " + err?.message });
    }
}