import React from "react";

const Card = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default Card;
