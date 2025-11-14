import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import FileUploader from "../components/FileUploader";
import Header from "../components/Header";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use((req) => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

const UploadDokumen = () => {
  const [projects, setProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState("");

  const loadProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
    if (res.data[0]) setSelected(res.data[0]._id);
  };

  // ✅ Bungkus dengan useCallback
  const loadFiles = useCallback(async () => {
    if (!selected) return;
    const res = await API.get(`/files?projectId=${selected}`);
    setFiles(res.data);
  }, [selected]);

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { if (selected) loadFiles(); }, [selected, loadFiles]); // ✅ tambahkan loadFiles ke deps

  return (
    <div>
      <Header title="Upload Dokumen Proyek" subtitle="Foto, BA, Drawing, Laporan PDF" />
      <div className="flex gap-2 items-center mb-4">
        <select className="border p-2 rounded" value={selected} onChange={e => setSelected(e.target.value)}>
          {projects.map(p => <option key={p._id} value={p._id}>{p.namaProyek}</option>)}
        </select>
        <FileUploader projectId={selected} onUploaded={loadFiles} />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sky-100">
            <tr>
              <th className="p-3 text-left">Nama File</th>
              <th className="p-3 text-left">Tipe</th>
              <th className="p-3 text-left">Ukuran (KB)</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {files.map(f => (
              <tr key={f._id} className="border-b">
                <td className="p-3">{f.originalName}</td>
                <td className="p-3">{f.mimeType}</td>
                <td className="p-3">{Math.round((f.size || 0) / 1024)}</td>
                <td className="p-3 text-center">
                  <a
                    className="text-sky-600 hover:underline mr-3"
                    href={`http://localhost:5000/${f.path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat
                  </a>
                  <a
                    className="text-green-600 hover:underline mr-3"
                    href={`http://localhost:5000/api/files/${f._id}/download`}
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
            {files.length === 0 && <tr><td className="p-3" colSpan={4}>Belum ada file</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadDokumen;
