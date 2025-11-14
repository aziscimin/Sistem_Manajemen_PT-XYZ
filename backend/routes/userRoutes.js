import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { getUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.use(protect, authorizeRole("admin"));

router.route("/")
  .get(getUsers)
  .post(createUser);

router.route("/:id")
  .put(updateUser)
  .delete(deleteUser);

export default router;
