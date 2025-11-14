import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  tanggal: { type: Date, default: Date.now },
  kategori: { type: String, enum: ["Bahan", "Transportasi", "Upah", "Alat", "Lain-lain"], required: true },
  deskripsi: { type: String },
  jumlah: { type: Number, required: true, min: 0 },
  dibuatOleh: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Finance", financeSchema);
