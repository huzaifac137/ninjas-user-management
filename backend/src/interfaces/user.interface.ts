import { Document , Types } from "mongoose";
import { IRole } from "./role.interface";
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: Types.ObjectId | IRole;
}