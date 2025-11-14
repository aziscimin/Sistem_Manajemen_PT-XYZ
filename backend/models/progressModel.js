import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tanggal: { type: Date, default: Date.now },
  aktivitas: { type: String, required: true },
  persentase: { type: Number, min: 0, max: 100 },
  foto: { type: String }, // bisa diisi URL hasil upload
  status: { type: String, enum: ["Menunggu", "Disetujui", "Ditolak"], default: "Menunggu" },
  catatanAdmin: { type: String },
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);
