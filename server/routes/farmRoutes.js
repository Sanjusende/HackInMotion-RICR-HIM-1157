import express from "express";
import { createFarm, getFarms, getFarmById, updateFarm, deleteFarm } from "../controllers/farm/farmController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Restrict all CRUD routes to authenticated requests only
router.use(authMiddleware);

router.post("/", createFarm);
router.get("/", getFarms);
router.get("/:id", getFarmById);
router.put("/:id", updateFarm);
router.delete("/:id", deleteFarm);

export default router;
