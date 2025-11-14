import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <Outlet /> {/* Semua halaman admin akan tampil di sini */}
      </div>
    </div>
  );
};

export default AdminDashboard;
