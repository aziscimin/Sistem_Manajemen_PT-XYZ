import Finance from "../models/financeModel.js";
import mongoose from "mongoose";

export const createFinance = async (req, res) => {
  try {
    const finance = await Finance.create({ ...req.body, dibuatOleh: req.user.id });
    res.status(201).json({ message: "Pengeluaran ditambahkan", finance });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const listFinance = async (req, res) => {
  try {
    const { projectId, from, to } = req.query;
    const q = {};
    if (projectId) q.projectId = projectId;
    if (from || to) q.tanggal = { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) };

    const items = await Finance.find(q).sort({ tanggal: -1 });
    const total = items.reduce((s, i) => s + (i.jumlah || 0), 0);
    res.json({ items, total });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const summaryByCategory = async (req, res) => {
  try {
    const { projectId } = req.query;
    const match = projectId ? { projectId: new mongoose.Types.ObjectId(projectId) } : {};
    const agg = await Finance.aggregate([
      { $match: match },
      { $group: { _id: "$kategori", total: { $sum: "$jumlah" } } },
      { $project: { _id: 0, kategori: "$_id", total: 1 } }
    ]);
    res.json(agg);
  } catch (e) { res.status(500).json({ message: e.message }); }
};

export const deleteFinance = async (req, res) => {
  try {
    await Finance.findByIdAndDelete(req.params.id);
    res.json({ message: "Pengeluaran dihapus" });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
