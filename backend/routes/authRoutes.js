import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Contoh route proteksi
router.get("/admin", protect, authorizeRole("admin"), (req, res) => {
  res.json({ message: "Selamat datang Admin!" });
});

export default router;
