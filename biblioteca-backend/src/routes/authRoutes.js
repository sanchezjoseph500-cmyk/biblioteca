import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import { validateLogin, validateRegistro } from "../middleware/validate.js";

const router = Router();

router.post("/login", validateLogin, AuthController.login);
router.post("/registro", validateRegistro, AuthController.registro);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/perfil", authMiddleware, AuthController.perfil);

export default router;
