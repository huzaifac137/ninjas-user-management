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
        const {name , email , password , roleId} = req.body;
        const existingUserEmail = await User.findOne({
            email: req.body.email.toLowerCase(),
          });

        const existingUserRole = await Role.findById(roleId);

          if(!existingUserRole){
            res.status(StatusCodes.CONFLICT).json({ message: "Role does not exist" });
            return;
          }

          if(existingUserRole.name==="super_admin"){
            res.status(403).json({message : "Cannot create a super admin using this!"});
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
            role: existingUserRole.id,
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
        const {name , email} = req.body;


        const user=await User.findById(req.params.id);
        if(!user){
            res.status(404).json({message:"User not found"});
            return;
        }

        if(email){
          
          const existingUserEmail = await User.findOne({
            email: email.toLowerCase(),
          });
          
          if(existingUserEmail && existingUserEmail.id !== user.id){
            res.status(StatusCodes.CONFLICT).json({ message: "Email already exists" });
            return;
          }

        }

        if(name){
            user.name=name;
        }
        if(email){
            user.email=email;
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

        if(user?._id?.toString()===req?.dbUser?._id?.toString()){
          res.status(400).json({message : "Cannot delete yourself"});
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
        const {userId , roleId} = req.params;
        const existingUserRole = await Role.findById(roleId);

          if (!existingUserRole) {
            res.status(StatusCodes.CONFLICT).json({ message: "Role does not exist" });
            return;
          }
         
          if(existingUserRole?.name==="super_admin"){
              res.status(400).json({message : "Cannot assign super admin role to someone"});
              return;
          }

          const user=await User.findById(userId).populate({
            path : "role",
            select : "name"
          });

          if(!user){
            res.status(404).json({message:"User not found"});
            return;
          }

          if((user?.role as IRole)?.name==="super_admin"){
            res.status(400).json({message : "Cannot change role of super admin"});
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
