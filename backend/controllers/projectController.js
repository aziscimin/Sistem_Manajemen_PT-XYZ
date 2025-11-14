import Project from "../models/projectModel.js";
import Finance from "../models/financeModel.js";
import File from "../models/fileModel.js";

// Admin ➕ Tambah proyek
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ message: "Proyek berhasil dibuat", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Semua user 👀 Lihat proyek (admin = semua, karyawan = miliknya)
export const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.find().populate("penanggungJawab", "name email");
    } else {
      projects = await Project.find({ penanggungJawab: req.user.id }).populate("penanggungJawab", "name email");
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin ✏️ Edit proyek
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Proyek berhasil diupdate", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin ❌ Hapus proyek
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Proyek berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin 👥 Assign anggota proyek
export const assignMembers = async (req, res) => {
  try {
    const { penanggungJawab, members } = req.body; // array of userIds untuk members
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { penanggungJawab, members },
      { new: true }
    )
      .populate("penanggungJawab", "name email")
      .populate("members", "name email");

    res.json({ message: "Assignment disimpan", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Tambahan Baru — Detail Proyek Lengkap
export const getProjectDetail = async (req, res) => {
  try {
    const p = await Project.findById(req.params.id)
      .populate("penanggungJawab", "name email")
      .populate("members", "name email");

    if (!p) return res.status(404).json({ message: "Proyek tidak ditemukan" });

    const Progress = (await import("../models/progressModel.js")).default;
    const lastProgress = await Progress.find({ projectId: p._id })
      .sort({ tanggal: -1 })
      .limit(1);

    const finance = await Finance.aggregate([
      { $match: { projectId: p._id } },
      { $group: { _id: null, total: { $sum: "$jumlah" } } },
    ]);
    const totalPengeluaran = finance[0]?.total || 0;

    const files = await File.find({ projectId: p._id }).sort({ createdAt: -1 });

    res.json({
      project: p,
      lastProgress: lastProgress[0] || null,
      totalPengeluaran,
      files,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
