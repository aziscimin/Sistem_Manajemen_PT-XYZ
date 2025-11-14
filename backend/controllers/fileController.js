import File from "../models/fileModel.js";
import fs from "fs";

export const listFiles = async (req, res) => {
  try {
    const { projectId, type } = req.query;
    const q = {};
    if (projectId) q.projectId = projectId;
    if (type) q.type = type;

    const files = await File.find(q)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const uploadFileMeta = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File tidak ditemukan" });
    const { projectId, progressId, type } = req.body;

    const doc = await File.create({
      projectId,
      progressId: progressId || undefined,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user.id,
      type: type || "dokumen", // 🆕
    });

    res.status(201).json({ message: "Upload berhasil", file: doc });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File tidak ada" });
    if (!fs.existsSync(file.path)) return res.status(404).json({ message: "Path file tidak ada" });
    res.download(file.path, file.originalName);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File tidak ada" });
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    await file.deleteOne();
    res.json({ message: "File dihapus" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const verifyFile = async (req, res) => {
  try {
    const file = await File.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: "File tidak ditemukan" });
    res.json({ message: "File berhasil diverifikasi", file });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
