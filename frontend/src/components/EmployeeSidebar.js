import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const EmployeeSidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-2 rounded-lg transition-all duration-150 ${
      isActive ? "bg-teal-600 shadow-inner" : "hover:bg-teal-600"
    }`;

  return (
    <div className="w-64 bg-teal-700 text-white p-5 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">🏗️ PT Konstruksi</h1>

      <nav className="flex-1 space-y-2">
        <NavLink to="/employee/dashboard" className={linkClass}>
          🏠 <span>Dashboard</span>
        </NavLink>

        <NavLink to="/employee/progress" className={linkClass}>
          📝 <span>Laporan Progress</span>
        </NavLink>

        {/* 🆕 Tambahan menu upload absensi */}
        <NavLink to="/employee/absensi" className={linkClass}>
          📸 <span>Upload Absensi</span>
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

export default EmployeeSidebar;
