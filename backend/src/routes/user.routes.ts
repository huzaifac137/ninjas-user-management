import { Router } from "express";
import { verifyToken, isSuperAdminOrAdmin} from "../middlewares/index";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, assignRoleToUser } from "../controllers/index";
import { seedRolesAndPermissions } from "../seeders/rolesAndPermissions";
import { isSuperAdmin } from "../middlewares/isSuperAdmin";
import { isSeeder } from "../middlewares/isSeeder";
const userRouter = Router();

// for public access from frontend
userRouter.get("/", verifyToken, isSuperAdminOrAdmin, getAllUsers);
userRouter.get("/:id", verifyToken, getUserById);
userRouter.post("/", verifyToken, isSuperAdminOrAdmin, createUser);
userRouter.put("/:id", verifyToken, isSuperAdmin, updateUser);
userRouter.delete("/:id", verifyToken, isSuperAdminOrAdmin, deleteUser);
userRouter.put("/:userId/role", verifyToken, isSuperAdminOrAdmin, assignRoleToUser);

// seeders (only to be used by backend dev , hidden from UI)
userRouter.post("/roles-permissions/seed-it" , isSeeder , seedRolesAndPermissions);
export default userRouter;