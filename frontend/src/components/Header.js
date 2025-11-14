import React from "react";

const Header = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    {subtitle && <p className="text-gray-500">{subtitle}</p>}
  </div>
);

export default Header;
