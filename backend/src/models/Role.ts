import mongoose, { Model, Schema, Document } from "mongoose";
import { IRole } from "../interfaces/index";
export interface IRoleDocument extends IRole, Document {}
const roleSchema: Schema<IRoleDocument> = new Schema<IRoleDocument>(
  {
  
    name: {
      type: String,
      required: true,
      index: "text"
    },
    permissions : {
          type: [mongoose.Types.ObjectId] ,
          ref : "Permission"
    }
},
  {
    timestamps: true,
  }
);
const Role: Model<IRoleDocument> = mongoose.model<IRoleDocument>(
  "Role",
  roleSchema
);
export default Role;
