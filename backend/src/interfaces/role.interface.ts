import { Types } from "mongoose";

export interface IRole {
    name: string;
    permissions : Types.ObjectId[];
}