import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectDetail, // ✅ import baru
} from "../controllers/projectController.js";

const router = express.Router();

// Admin: CRUD, Karyawan: Read only
router
  .route("/")
  .get(protect, getProjects)
  .post(protect, authorizeRole("admin"), createProject);

router
  .route("/:id")
  .put(protect, authorizeRole("admin"), updateProject)
  .delete(protect, authorizeRole("admin"), deleteProject);

// ✅ Tambahan Baru — Detail proyek lengkap
router.get("/:id/detail", protect, getProjectDetail);

export default router;
