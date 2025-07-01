import {Request , Response} from "express";
import Role from "../models/Role";
import Permission from "../models/Permission";
import { Types } from "mongoose";
import { roles } from "../seeders/rolesAndPermissions";

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

export  const createRole=async(req: Request , res: Response)=>{
    try{
        const {name} = req.body;
        const existingRole = await Role.findOne({name});
        if(existingRole){
             res.status(400).json({message : "Role already exists"});
             return;
        }
        const newRole = new Role({
            name,
            permissions : []
        });
        await newRole.save();
        res.status(201).json({message : "Role created successfully" , role : newRole});
    }
    catch(err){
        res.status(500).json({ message: "Error creating role: " + err?.message });
    }
}

export const assignPermissionsToRole=async(req: Request , res: Response)=>{
    try{
        const {roleId , permissionIds} = req.body;
        const role = await Role.findById(roleId);
        if(!role){
             res.status(400).json({message : "Role does not exist"});
             return;
        }

        const permissions = await Permission.find({
            _id : {$in : permissionIds}
        });


        const permissionsAsIds = permissions.map((permission)=>permission._id) as Types.ObjectId[];
        const filteredPermissionIds = permissionsAsIds.filter((id)=>role?.permissions?.includes(id)===false);

        role.permissions.push(...filteredPermissionIds);
        await role.save();
        res.status(200).json({message : "Permissions assigned successfully"});
    }
    catch(err){
        res.status(500).json({ message: "Error assigning permissions: " + err?.message });
    }
}

export const removePermissionsFromRole=async(req: Request , res: Response)=>{
    try{
        const {roleId , permissionIds} = req.body;
        const role = await Role.findById(roleId);
        if(!role){
             res.status(400).json({message : "Role does not exist"});
             return;
        }

        const permissions = await Permission.find({
            _id : {$in : permissionIds}
        });

        const permissionsAsIds = permissions.map((permission)=>permission._id) as Types.ObjectId[];
        const filteredPermissionIds = permissionsAsIds.filter((id)=>role?.permissions?.includes(id)===false);
        role.permissions = filteredPermissionIds;

        await role.save();
        res.status(200).json({message : "Permissions removed successfully"});
    }
    catch(err){
        res.status(500).json({ message: "Error removing permissions: " + err?.message });
    }
}