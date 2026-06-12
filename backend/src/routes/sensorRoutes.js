import express from "express";
import {
  createSensor,
  getSensors,
  getSensorById,
  updateSensor,
  deleteSensor,
  fetchSensorData,
} from "../controllers/sensorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ normal routes
router.post("/", protect, createSensor);
router.get("/", protect, getSensors);

// ✅ IMPORTANT: KEEP THIS BEFORE ":id"
router.post("/fetch", protect, fetchSensorData);

// ✅ dynamic routes LAST
router.get("/:id", protect, getSensorById);
router.put("/:id", protect, updateSensor);
router.delete("/:id", protect, deleteSensor);

export default router;