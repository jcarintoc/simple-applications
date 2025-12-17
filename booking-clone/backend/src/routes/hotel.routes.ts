import { Router } from "express";
import { hotelController } from "../controllers/index.js";

const router = Router();

router.get("/", (req, res) => hotelController.search(req, res));
router.get("/featured", (req, res) => hotelController.getFeatured(req, res));
router.get("/:id", (req, res) => hotelController.getById(req, res));

export default router;
