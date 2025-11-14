import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";

const NotificationBell = () => {
  const [items, setItems] = useState([]);
  API.interceptors.request.use((req) => {
    const t = localStorage.getItem("token");
    if (t) req.headers.Authorization = `Bearer ${t}`;
    return req;
  });

  // ✅ Gunakan useCallback agar referensi fungsi stabil
  const fetchNotifs = useCallback(async () => {
    const res = await API.get("/");
    setItems(res.data);
  }, [API]);

  const markRead = async (id) => {
    await API.put(`/${id}/read`);
    fetchNotifs();
  };

  // ✅ Masukkan fetchNotifs ke dependency array
  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  return (
    <div className="relative">
      <button className="relative bg-white border rounded px-3 py-1">
        🔔
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            {items.length}
          </span>
        )}
      </button>

      {items.length > 0 && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow p-2 z-10">
          {items.map((n) => (
            <div key={n._id} className="flex justify-between items-center border-b py-2">
              <div className="text-sm">{n.message}</div>
              <button
                onClick={() => markRead(n._id)}
                className="text-sky-600 text-xs"
              >
                Tandai
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
