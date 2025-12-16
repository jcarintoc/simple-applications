import { Router } from "express";
import { getCsrfToken } from "../controllers/csrf.controller.js";

const router = Router();

router.get("/", getCsrfToken);

export default router;
