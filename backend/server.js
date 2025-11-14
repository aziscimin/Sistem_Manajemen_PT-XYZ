import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import fileRoutes from "./routes/fileRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads")); // serve file statis lokal
app.use("/api/files", fileRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
