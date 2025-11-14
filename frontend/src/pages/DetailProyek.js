import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import Header from "../components/Header";

API.interceptors.request.use((req) => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

const DetailProyek = ({ projectIdFromProp }) => {
  const [data, setData] = useState(null);
  const id = projectIdFromProp || new URLSearchParams(window.location.search).get("id");

  // ✅ Gunakan useCallback
  const load = useCallback(async () => {
    const res = await API.get(`/projects/${id}/detail`);
    setData(res.data);
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]); // ✅ tambahkan 'load' ke dependency

  if (!data) return <div>Memuat...</div>;

  const { project, lastProgress, totalPengeluaran, files } = data;

  return (
    <div>
      <Header title={`Detail Proyek: ${project.namaProyek}`} subtitle={project.lokasi} />
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">Informasi Umum</h3>
          <p>Status: {project.status}</p>
          <p>Penanggung Jawab: {project.penanggungJawab?.name || "-"}</p>
          <p>Anggota: {(project.members || []).map(m => m.name).join(", ") || "-"}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">Ringkasan</h3>
          <p>Progress Terakhir: {lastProgress ? `${lastProgress.persentase}%` : "-"}</p>
          <p>Total Pengeluaran: Rp {totalPengeluaran.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Dokumen Terkait</h3>
        <ul className="list-disc ml-6">
          {files.map(f => (
            <li key={f._id}>
              <a
                className="text-sky-600 hover:underline"
                href={`http://localhost:5000/${f.path}`}
                target="_blank"
                rel="noreferrer"
              >
                {f.originalName}
              </a>
            </li>
          ))}
          {files.length === 0 && <p>- Belum ada dokumen -</p>}
        </ul>
      </div>
    </div>
  );
};

export default DetailProyek;
