import { Router } from "express";
import { createPermission, deletePermissionFromApp, getAllPermissions } from "../controllers/index";
import { verifyToken } from "../middlewares";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
const permissionRouter = Router();

// for public access from frontend
permissionRouter.get("/" , getAllPermissions);
permissionRouter.post("/" , verifyToken , isSuperAdmin , createPermission);
permissionRouter.delete("/:permissionId" , verifyToken , isSuperAdmin ,deletePermissionFromApp);
export default permissionRouter;