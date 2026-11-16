import express from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMyProject,
  getProjectGraph
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
=================================
✅ PROJECT CRUD ROUTES
=================================
*/

router.post(
  "/",
  protect,
  createProject
);

router.get(
  "/",
  protect,
  getProjects
);

router.get(
  "/:id",
  protect,
  getProjectById
);

router.put(
  "/:id",
  protect,
  updateProject
);

router.delete(
  "/:id",
  protect,
  deleteProject
);
router.get(
  "/:projectId/graph",
  protect,
  getProjectGraph
);
/*
=================================
✅ STUDENT PROJECT ROUTE
=================================
*/

router.get(
  "/student/my-project",
  protect,
  getMyProject
);

export default router;