import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listNotifications, markRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, listNotifications);
router.put("/:id/read", protect, markRead);

export default router;
