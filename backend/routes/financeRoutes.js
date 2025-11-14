import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { createFinance, listFinance, summaryByCategory, deleteFinance } from "../controllers/financeController.js";

const router = express.Router();

// Admin & role "keuangan" boleh input; contoh sederhana: admin saja
router.post("/", protect, authorizeRole("admin"), createFinance);
router.get("/", protect, listFinance);
router.get("/summary", protect, summaryByCategory);
router.delete("/:id", protect, authorizeRole("admin"), deleteFinance);

export default router;
