import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ===== Halaman utama =====
import Login from "./pages/Login";

// ===== Layout utama =====
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

// ===== Halaman Admin =====
import Projects from "./pages/Projects";
import Employees from "./pages/Employees";
import ProgressAdmin from "./pages/ProgressAdmin";

// ✅ Tambahan Tahap 5 (Admin)
import DashboardAnalytics from "./pages/DashboardAnalytics";
import UploadDokumen from "./pages/UploadDokumen";
import LaporanKeuangan from "./pages/LaporanKeuangan";
import DetailProyek from "./pages/DetailProyek";

// ===== Halaman Employee =====
import ProgressEmployee from "./pages/ProgressEmployee";

// ✅ Tambahan Fitur Absensi
import AbsenAdmin from "./pages/AbsenAdmin";
import AbsenKaryawan from "./pages/AbsenKaryawan";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Halaman Login */}
      <Route path="/" element={<Login />} />

      {/* ====== ADMIN ROUTES ====== */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="dashboard" element={<Projects />} />
        <Route path="employees" element={<Employees />} />
        <Route path="progress" element={<ProgressAdmin />} />

        {/* ✅ Fitur Baru */}
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="uploads" element={<UploadDokumen />} />
        <Route path="finance" element={<LaporanKeuangan />} />
        <Route path="project-detail" element={<DetailProyek />} />

        {/* 🆕 Halaman Absensi Admin */}
        <Route path="absensi" element={<AbsenAdmin />} />
      </Route>

      {/* ====== EMPLOYEE ROUTES ====== */}
      <Route path="/employee" element={<EmployeeDashboard />}>
        <Route path="dashboard" element={<Projects />} />
        <Route path="progress" element={<ProgressEmployee />} />

        {/* 🆕 Halaman Absensi Karyawan */}
        <Route path="absensi" element={<AbsenKaryawan />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
