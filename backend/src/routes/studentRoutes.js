import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getStudentProfile,
  updateStudentProfile
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/profile", protect, getStudentProfile);

router.put(
  "/profile",
  protect,
  updateStudentProfile
);

export default router;