import { Router } from "express";
import { verifyToken, isSuperAdminOrAdmin} from "../middlewares/index";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, assignRoleToUser } from "../controllers/index";
import { seedRolesAndPermissions } from "../seeders/rolesAndPermissions";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { isSeeder } from "../middlewares/isSeeder";
import { validateCreateUser, validateUpdateUser } from "../validations/validation";
const userRouter = Router();

// for public access from frontend
userRouter.get("/", verifyToken, isSuperAdminOrAdmin, getAllUsers);
userRouter.get("/:id", verifyToken, isSuperAdminOrAdmin , getUserById);
userRouter.post("/", validateCreateUser , verifyToken, isSuperAdminOrAdmin, createUser);
userRouter.put("/:id", validateUpdateUser , verifyToken, isSuperAdmin, updateUser);
userRouter.delete("/:id", verifyToken, isSuperAdminOrAdmin, deleteUser);
userRouter.put("/:userId/role/:roleId", verifyToken, isSuperAdminOrAdmin, assignRoleToUser);

// seeders (only to be used by backend dev , hidden from UI)
userRouter.post("/roles-permissions/seed-it" , isSeeder , seedRolesAndPermissions);
export default userRouter;