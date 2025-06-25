import { Router } from "express";
import { getAllRoles } from "../controllers/index";
import { verifyToken } from "../middlewares";
const roleRouter = Router();

// for public access from frontend
roleRouter.get("/", verifyToken , getAllRoles);

export default roleRouter;