import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  namaProyek: { type: String, required: true },
  lokasi: { type: String, required: true },
  status: {
    type: String,
    enum: ["Perencanaan", "Berjalan", "Selesai"],
    default: "Perencanaan",
  },
  penanggungJawab: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ baru
  deskripsi: { type: String },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
