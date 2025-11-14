import React, { useEffect, useState } from "react";
import API from "../api/api";

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

const AbsenAdmin = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await API.get("/files/?type=absen");
    setFiles(res.data);
  };

  const verifyFile = async (id) => {
    await API.put(`/files/${id}/verify`);
    fetchFiles();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-sky-700">Verifikasi Absen Karyawan</h1>
      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-sky-100">
          <tr>
            <th className="p-3 text-left">Karyawan</th>
            <th className="p-3 text-left">Nama File</th>
            <th className="p-3 text-left">Tanggal Upload</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f._id} className="border-b hover:bg-slate-50">
              <td className="p-3">{f.uploadedBy?.name}</td>
              <td className="p-3">
                <a
                  href={`http://localhost:5000/${f.path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:underline"
                >
                  {f.originalName}
                </a>
              </td>
              <td className="p-3">{new Date(f.createdAt).toLocaleString()}</td>
              <td className="p-3">
                {f.verified ? (
                  <span className="text-green-600 font-semibold">✅ Disetujui</span>
                ) : (
                  <button
                    onClick={() => verifyFile(f._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Setujui
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenAdmin;
