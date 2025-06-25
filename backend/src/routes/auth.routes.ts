import { Router } from "express";
import { Login, Signup } from "../controllers/index";
import { validateLogin, validateSignup } from "../validations/validation";
const router = Router();
// only for creating super admin manually (not from frontend UI)
router.post("/signup/super-admin", validateSignup, Signup);

// login any type of user
router.post("/login",validateLogin, Login);
export default router;
