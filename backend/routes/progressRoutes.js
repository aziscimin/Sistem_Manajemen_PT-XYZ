import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { addProgress, getProgress, updateProgressStatus } from "../controllers/progressController.js";

const router = express.Router();

// Karyawan: tambah progress, lihat progress milik sendiri
router.route("/")
  .get(protect, getProgress)
  .post(protect, authorizeRole("karyawan"), addProgress);

// Admin: ubah status laporan
router.put("/:id/status", protect, authorizeRole("admin"), updateProgressStatus);

export default router;
