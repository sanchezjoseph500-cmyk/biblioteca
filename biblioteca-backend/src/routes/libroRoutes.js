import { Router } from "express";
import { LibroController } from "../controllers/libroController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validateLibro } from "../middleware/validate.js";

const router = Router();

router.use(authMiddleware);

router.get("/", LibroController.getAll);
router.get("/:id", LibroController.getById);
router.post("/", requireRole("admin", "empleado"), validateLibro, LibroController.create);
router.put("/:id", requireRole("admin", "empleado"), validateLibro, LibroController.update);
router.delete("/:id", requireRole("admin"), LibroController.delete);

export default router;
