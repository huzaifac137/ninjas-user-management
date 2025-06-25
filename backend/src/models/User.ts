import mongoose, { Model, Schema, Document } from "mongoose";
import { IUser } from "../interfaces/index";
export interface IUserDocument extends IUser, Document {}
const userSchema: Schema<IUserDocument> = new Schema<IUserDocument>(
  {
  
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required:true
      },
    role:{
       type: mongoose.Types.ObjectId,
       ref : "Role",
       required: true
     },
},
  {
    timestamps: true,
  }
);
const User: Model<IUserDocument> = mongoose.model<IUserDocument>(
  "User",
  userSchema
);
export default User;
