import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// GET all users (hanya admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create employee/admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "karyawan" } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email sudah terdaftar" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ message: "User dibuat", user: { ...user._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update user (nama, email, role, ganti password opsional)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const payload = { name, email, role };
    if (password) payload.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, payload, { new: true }).select("-password");
    res.json({ message: "User diupdate", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
