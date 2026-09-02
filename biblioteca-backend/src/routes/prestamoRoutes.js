import { Router } from "express";
import { PrestamoController } from "../controllers/prestamoController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import { validatePrestamo } from "../middleware/validate.js";

const router = Router();

router.use(authMiddleware);

router.get("/", requireRole("admin", "empleado"), PrestamoController.getAll);
router.get("/mis", PrestamoController.getMisPrestamos);
router.get("/:id", PrestamoController.getById);
router.post("/", requireRole("admin", "empleado"), validatePrestamo, PrestamoController.create);
router.post("/solicitud", PrestamoController.solicitud);
router.put("/:id/aprobar", requireRole("admin", "empleado"), PrestamoController.aprobar);
router.put("/:id/notificar-tardio", requireRole("admin", "empleado"), PrestamoController.notificarTardio);
router.delete("/:id", PrestamoController.delete);

export default router;
