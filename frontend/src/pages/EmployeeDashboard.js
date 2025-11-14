import React from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import { Outlet } from "react-router-dom";

const EmployeeDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <EmployeeSidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
