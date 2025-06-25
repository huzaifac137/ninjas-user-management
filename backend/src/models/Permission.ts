import mongoose, { Model, Schema, Document } from "mongoose";
import { IPermission } from "../interfaces/index";
export interface IPermissionDocument extends IPermission, Document {}
const roleSchema: Schema<IPermissionDocument> = new Schema<IPermissionDocument>(
  {
  
    name: {
      type: String,
      required: true,
      index: "text"
    },
},
  {
    timestamps: true,
  }
);
const Permission: Model<IPermissionDocument> = mongoose.model<IPermissionDocument>(
  "Permission",
  roleSchema
);
export default Permission;
