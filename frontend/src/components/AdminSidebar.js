import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-2 rounded-lg transition-all duration-150 ${
      isActive ? "bg-sky-600 shadow-inner" : "hover:bg-sky-600"
    }`;

  return (
    <div className="w-64 bg-sky-700 text-white p-5 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">🏗️ PT Konstruksi</h1>

      <nav className="flex-1 space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          📋 <span>Dashboard Proyek</span>
        </NavLink>

        <NavLink to="/admin/employees" className={linkClass}>
          👷‍♂️ <span>Data Karyawan</span>
        </NavLink>

        <NavLink to="/admin/progress" className={linkClass}>
          🧱 <span>Laporan Proyek</span>
        </NavLink>

        {/* ✅ Tambahan fitur baru dari App.js */}
        <NavLink to="/admin/analytics" className={linkClass}>
          📊 <span>Dashboard Analitik</span>
        </NavLink>

        <NavLink to="/admin/uploads" className={linkClass}>
          📎 <span>Upload Dokumen</span>
        </NavLink>

        <NavLink to="/admin/finance" className={linkClass}>
          💰 <span>Laporan Keuangan</span>
        </NavLink>

        <NavLink to="/admin/project-detail" className={linkClass}>
          🧾 <span>Detail Proyek</span>
        </NavLink>

        {/* 🆕 Tambahan menu absensi */}
        <NavLink to="/admin/absensi" className={linkClass}>
          📸 <span>Verifikasi Absensi</span>
        </NavLink>
      </nav>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 p-2 rounded mt-6 font-semibold shadow"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
