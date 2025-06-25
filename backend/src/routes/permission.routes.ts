import { Router } from "express";
import { getAllPermissions } from "../controllers/index";
import { verifyToken } from "../middlewares";
const permissionRouter = Router();

// for public access from frontend
permissionRouter.get("/" , getAllPermissions);

export default permissionRouter;