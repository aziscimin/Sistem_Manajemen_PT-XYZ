import Progress from "../models/progressModel.js";
import Notification from "../models/notificationModel.js";

// ✅ Karyawan menambah laporan progress
export const addProgress = async (req, res) => {
  try {
    const { projectId, aktivitas, persentase, foto } = req.body;
    const progress = await Progress.create({
      projectId,
      userId: req.user.id,
      aktivitas,
      persentase,
      foto,
    });
    res.status(201).json({ message: "Progress ditambahkan", progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Lihat progress: admin semua, karyawan miliknya
export const getProgress = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "karyawan") query.userId = req.user.id;

    const progressList = await Progress.find(query)
      .populate("projectId", "namaProyek lokasi")
      .populate("userId", "name role");
    res.json(progressList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const updateProgressStatus = async (req, res) => {
  try {
    const { status, catatanAdmin } = req.body;
    const progress = await Progress.findByIdAndUpdate(
      req.params.id,
      { status, catatanAdmin },
      { new: true }
    ).populate("userId", "name");

    // Tambahkan notifikasi ke pemilik laporan
    await Notification.create({
      userId: progress.userId._id,
      message: `Laporan progres Anda ${status.toLowerCase()} oleh admin`,
      type: "progress",
    });

    res.json({ message: "Status progress diperbarui", progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
