import express from "express";
import {
  createObservation,
  getObservations,
  getObservationById,
  deleteObservation
} from "../controllers/observationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ ROUTES
router.post("/", protect, createObservation);
router.get("/", protect, getObservations);
router.get("/:id", protect, getObservationById);
router.delete("/:id", protect, deleteObservation);

router.post("/", createObservation);
router.get("/", getObservations);

export default router;