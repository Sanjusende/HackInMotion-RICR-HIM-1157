import express from "express";

import {
    createFarm,
    getFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
} from "../controllers/farm/farmController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Farm Routes
|--------------------------------------------------------------------------
*/

router.post("/", authMiddleware, createFarm);

router.get("/", authMiddleware, getFarms);

router.get("/:id", authMiddleware, getFarmById);

router.put("/:id", authMiddleware, updateFarm);

router.delete("/:id", authMiddleware, deleteFarm);

export default router;