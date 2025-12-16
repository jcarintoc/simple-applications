import { Router } from "express";
import { csrfController } from "../controllers/csrf.controller.js";
import { setCsrfToken } from "../middleware/csrf.middleware.js";

const router = Router();

router.get("/csrf-token", setCsrfToken, csrfController.getCsrfToken);

export default router;
