import express from "express";

import {
  register,
  login,
  forgotPassword,
  getUsers,
  getStudents,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================================
   ✅ AUTH ROUTES
================================ */

router.post("/register", register);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

/* ================================
   ✅ USER CRUD ROUTES
================================ */

// Get all users
router.get("/", protect, getUsers);

// Get only students
router.get("/students", protect, getStudents);

// Get single user
router.get("/:id", protect, getUserById);

// Update user
router.put("/:id", protect, updateUser);

// Delete user
router.delete("/:id", protect, deleteUser);

export default router;