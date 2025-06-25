import Role from "../models/Role";
import { Request, Response } from "express";
import {IPermission, IRole} from "../interfaces/index";
import Permission from "../models/Permission";
import mongoose, { Types } from "mongoose";

export const permissions : IPermission[] = [{
    name : "create"
},{
    name : "view"
},{
    name : "update"
},{
    name : "delete"
}] as const;

export const roles: IRole[] = [
    {
        name: "super_admin",
        permissions : []
    },
    {
        name: "admin",
        permissions : []
    },
    {
        name: "user",
        permissions : []
    },
] as const;

export const seedRolesAndPermissions=async(req: Request , res: Response)=>{
    const session = await mongoose.startSession();
  try {
        session.startTransaction();

        // insert permissions
        for(const permission of permissions){
            const alreadyExists = await Permission.findOne({name : permission.name});
            if(!alreadyExists){
                await Permission.create([permission] , {session});
            }
        }

        // insert roles
        for(const role of roles){
            const alreadyExists = await Role.findOne({name : role.name});
            if(!alreadyExists){
                await Role.create([role] , {session});
            }
        }


        // filter out permissions for each user role
        const fetchedPermissions = await Permission.find({name : {$in : permissions.map((permission)=>permission.name)}});
        const permissionsForSuperAdmin = fetchedPermissions.map((permission)=> permission._id) as Types.ObjectId[];

        const permissionsForAdmin = fetchedPermissions.filter((permission)=>{
            return permission.name !== "update";
        }).map((permission)=> permission._id) as Types.ObjectId[];

        const permissionsForUser = fetchedPermissions.filter((permission)=>{
            return permission.name === "view";
        }).map((permission)=> permission._id) as Types.ObjectId[];;

        // assign permissions to roles
        const dbRoles = await Role.find({name : {$in : roles.map((role)=>role.name)}});
        
        dbRoles.forEach((role)=>{
            if(role.name === "super_admin"){
                role.permissions = permissionsForSuperAdmin;
            }
            if(role.name === "admin"){
                role.permissions = permissionsForAdmin;
            }
            if(role.name === "user"){
                role.permissions = permissionsForUser;
            }
            role.save({session});
        });

        await session.commitTransaction();
        console.log("seedRolesAndPermissions ----------> roles seeded into DB!");
        res.status(200).json({message:"Roles and permissions seeded into DB!"});
  } catch (error) {
        await session.abortTransaction();
        console.log("seedRolesAndPermissions ----------> error seeding roles and permissions into DB!");
        res.status(500).json({message:"Error seeding roles into DB! : " + error});
  }    
}
