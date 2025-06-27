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
}];

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
];

export const seedRolesAndPermissions=async(req: Request , res: Response)=>{
    const session = await mongoose.startSession();
  try {
        session.startTransaction();

        // insert permissions
        for(const permission of permissions){
            const alreadyExists = await Permission.findOne({name : permission.name});
            if(!alreadyExists){
                await Permission.create([permission]);
            }
        }

        // insert roles
        for(const role of roles){
            const alreadyExists = await Role.findOne({name : role.name});
            if(!alreadyExists){
                await Role.create([role]);
            }
        }


        // filter out permissions for each user role
        const fetchedPermissions = await Permission.find();
        const permissionsForSuperAdmin = fetchedPermissions.map((permission)=> permission._id) as Types.ObjectId[];

        console.log(JSON.stringify(permissionsForSuperAdmin));

        const permissionsForAdmin = fetchedPermissions.filter((permission)=>{
            return permission.name !== "update";
        }).map((permission)=> permission._id) as Types.ObjectId[];

        console.log(JSON.stringify(permissionsForAdmin));

        const permissionsForUser = fetchedPermissions.filter((permission)=>{
            return permission.name === "view";
        }).map((permission)=> permission._id) as Types.ObjectId[];

        console.log(JSON.stringify(permissionsForUser));

        // assign permissions to roles
        const dbRoles = await Role.find();
        
           for(const role of dbRoles){
            if(role.name === "super_admin"){
                role.permissions = permissionsForSuperAdmin;
            }
            else if(role.name === "admin"){
                role.permissions = permissionsForAdmin;
            }
            else if(role.name === "user"){
                role.permissions = permissionsForUser;
            }
            await role.save({session});
        }

        await session.commitTransaction();
        console.log("seedRolesAndPermissions ----------> roles seeded into DB!");
        res.status(200).json({message:"Roles and permissions seeded into DB!"});
  } catch (error) {
        await session.abortTransaction();
        console.log("seedRolesAndPermissions ----------> error seeding roles and permissions into DB!");
        res.status(500).json({message:"Error seeding roles into DB! : " + error});
  }    
}
