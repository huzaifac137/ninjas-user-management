import { Router } from "express";
import { assignPermissionsToRole, createRole, getAllRoles, removePermissionsFromRole } from "../controllers/index";
import { verifyToken } from "../middlewares";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { assignPermissionsValidation, createRoleValidation } from "../validations/validation";
const roleRouter = Router();

// for public access from frontend
roleRouter.get("/" , getAllRoles);
roleRouter.post("/" , createRoleValidation ,verifyToken , isSuperAdmin , createRole);
roleRouter.patch("/assign-permissions" , assignPermissionsValidation , verifyToken , isSuperAdmin, assignPermissionsToRole);
roleRouter.delete("/remove-permissions" , assignPermissionsValidation , verifyToken , isSuperAdmin, removePermissionsFromRole);

export default roleRouter;