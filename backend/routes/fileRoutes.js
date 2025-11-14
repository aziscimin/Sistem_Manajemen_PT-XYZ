import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { 
  listFiles, 
  uploadFileMeta, 
  downloadFile, 
  deleteFile,
  verifyFile // 🆕
} from "../controllers/fileController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});
const upload = multer({ storage });

// 🔹 Route yang ada
router.get("/", protect, listFiles);
router.post("/", protect, upload.single("file"), uploadFileMeta);
router.get("/:id/download", protect, downloadFile);
router.delete("/:id", protect, authorizeRole("admin"), deleteFile);

// 🔹 Route baru untuk verifikasi absensi
router.put("/:id/verify", protect, authorizeRole("admin"), verifyFile);

export default router;
