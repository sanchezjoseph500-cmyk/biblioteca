import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateUsuario } from "../middleware/validate.js";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("admin", "empleado"), UsuarioController.getAll);
router.get("/:id", requireRole("admin", "empleado"), UsuarioController.getById);
router.post("/", requireRole("admin"), validateUsuario, UsuarioController.create);
router.put("/:id", requireRole("admin"), validateUsuario, UsuarioController.update);
router.delete("/:id", requireRole("admin"), UsuarioController.delete);

export default router;
