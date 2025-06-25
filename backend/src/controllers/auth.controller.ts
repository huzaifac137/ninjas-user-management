import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import Jwt from "jsonwebtoken";
import Role from "../models/Role";


export const Signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password , roleId } = req.body;


    const existingUserEmail = await User.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (existingUserEmail) {
      res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User already exists with this email" });
      return;
    }

    const existingUserRole = await Role.findOne({name : "super_admin"})
    if(!existingUserRole){
      res.status(StatusCodes.CONFLICT).json({ message: "Super admin Role does not exist" });
      return;
    }

    if(existingUserRole.name!=="super_admin"){
      res.status(403).json({message : "This api is only for creating a super admin of the application manually!"});
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role : existingUserRole.id,
    });


    await user.save();
    res
      .status(StatusCodes.CREATED)
      .json({ message: "User created successfully" });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error creating user " + error.message });
  }
};

// all users can login using this
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, roleId, password } = req.body;

      let user = await User.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ message: "User with this email not found" });
        return;
      }

      const existingRole = await Role.findById(roleId);
      if(!existingRole){
        res.status(StatusCodes.CONFLICT).json({ message: "Role does not exist" });
        return;
      }



      if (user?.role?.toString() !== existingRole?._id?.toString()) {
        res
          .status(403)
          .json({
            messgae: "This account is not associated with this role",
          });
        return;
      }

      const comparepass = await bcrypt.compare(password, user.password);
      if (!comparepass) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Invalid Credentials" });
        return;
      }

  
      const accessToken = Jwt.sign(
        {
          _id: user.id,
        },
        process.env.JWT_SEC,
        { expiresIn: "30d" }
      );
      res.status(StatusCodes.OK).json({
        message: "User Loged In Successfully",
        user,
        accessToken,
      });
    
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Error Occured" + error.message });
  }
};