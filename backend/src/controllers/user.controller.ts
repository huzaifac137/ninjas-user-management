import { Request, Response } from "express";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import Role from "../models/Role";
import { IRole } from "../interfaces";


// only super admin or admin should be able to use this
export const getAllUsers=async(req: Request  , res: Response)=>{
    try {
         
        const users=await User.find({}).select("name email").populate({
            path : "role",
            select : "name"
        });
        res.status(200).json({message:"Users fetched successfully",users});
    } catch (error) {
        res.status(500).json({message:"Error fetching users : " + error.message});
    }
}

// only super admin or admin should be able to use this
export const getUserById=async(req: Request , res: Response)=>{
    try {
         const dbUser = req?.dbUser;

        const user=await User.findById(req.params.id).select("name email");
        if(!user){
            res.status(404).json({message:"User not found"});
            return;
        }
        res.status(200).json({message:"User fetched successfully",user});
    } catch (error) {
        res.status(500).json({message:"Error fetching user : " + error.message});
    }
}

// only super admin or admin
export const createUser=async(req: Request , res: Response)=>{
    try {
        const {name , email , password , role} = req.body;
        const existingUserEmail = await User.findOne({
            email: req.body.email.toLowerCase(),
          });

        const existingUserRole = await Role.findOne({
            name: role,
          });

          if(!existingUserRole){
            res.status(StatusCodes.CONFLICT).json({ message: "Role does not exist" });
            return;
          }

          if(existingUserRole.name==="super_admin"){
            res.status(403).json({message : "Only one person can be a super admin at a time"});
            return;
          }

          if (existingUserEmail) {
            res
              .status(StatusCodes.CONFLICT)
              .json({ message: "User already exists with this email" });
            return;
          }
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
          });
          await user.save();
          res.status(201).json({message:"User created successfully",user});
    } catch (error) {
        res.status(500).json({message:"Error creating user : " + error.message});
    }
}

// only super admin
export const updateUser=async(req: Request , res: Response)=>{
    try {
        const {name , email  , role} = req.body;

        const existingUserRole = await Role.findOne({
            name: role,
          });

          if (!existingUserRole) {
            res.status(StatusCodes.CONFLICT).json({ message: "Role does not exist" });
            return;
          }

          if(existingUserRole.name==="super_admin"){
            res.status(403).json({message : "Only one person can be a super admin at a time"});
            return;
          }

        const user=await User.findById(req.params.id);
        if(!user){
            res.status(404).json({message:"User not found"});
            return;
        }
        if(name){
            user.name=name;
        }
        if(email){
            user.email=email;
        }
        if(role){
            user.role=role;
        }

        await user.save();
        res.status(200).json({message:"User updated successfully",user});
    } catch (error) {
        res.status(500).json({message:"Error updating user : " + error.message});
    }
}

// only super admin or admin
export const deleteUser=async(req: Request , res: Response)=>{
       try {
        const user=await User.findById(req.params.id).populate({
          path : "role",
          select : "name"
        });

        if(!user){
            res.status(404).json({message:"User not found"});
            return;
        }

        if((user?.role as IRole)?.name==="super_admin"){
          res.status(400).json({message : "Cannot delete a super admin from the app"});
          return;
        }
        
        await user.deleteOne();
        res.status(201).json({message : "User deleted"});
       } catch (error) {
        res.status(500).json({message:"Error deleting user : " + error.message});
       }
}

// only super admin
export const assignRoleToUser=async(req: Request , res: Response)=>{
    try { 
        const {userId} = req.params;
        const {roleId} = req.body;
        const existingUserRole = await Role.findById(roleId);

          if (!existingUserRole) {
            res.status(StatusCodes.CONFLICT).json({ message: "Role does not exist" });
            return;
          }
         
          if(existingUserRole?.name==="super_admin"){
              res.status(400).json({message : "Only you/yourself can be super admin, cannot make another person super admin"});
              return;
          }

          const user=await User.findById(userId);

          if(!user){
            res.status(404).json({message:"User not found"});
            return;
          }

          user.role=existingUserRole.id;
          await user.save();
          res.status(200).json({message:"Role assigned successfully"});
          return;
         
    } catch (error) {
        res.status(500).json({message:"Error assigning role to user : " + error.message});
    }
}
