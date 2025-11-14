import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  progressId: { type: mongoose.Schema.Types.ObjectId, ref: "Progress" },
  originalName: String,
  mimeType: String,
  size: Number,
  path: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // 🆕 Tambahan:
  type: { 
    type: String, 
    enum: ["dokumen", "absen"], 
    default: "dokumen" 
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

export default mongoose.model("File", fileSchema);
