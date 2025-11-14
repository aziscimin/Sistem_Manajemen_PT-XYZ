import React, { useEffect, useState } from "react";
import FileUploader from "../components/FileUploader";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/files" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

const AbsenKaryawan = () => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await API.get("/?type=absen");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-sky-700">Upload Absen</h1>
      <FileUploader onUploaded={fetchFiles} projectId="" /> {/* projectId opsional */}
      <table className="w-full mt-6 bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-sky-100">
          <tr>
            <th className="p-3 text-left">Nama File</th>
            <th className="p-3 text-left">Tanggal Upload</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f._id} className="border-b hover:bg-slate-50">
              <td className="p-3">{f.originalName}</td>
              <td className="p-3">{new Date(f.createdAt).toLocaleString()}</td>
              <td className="p-3">
                {f.verified ? "✅ Disetujui" : "⏳ Menunggu verifikasi"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenKaryawan;
