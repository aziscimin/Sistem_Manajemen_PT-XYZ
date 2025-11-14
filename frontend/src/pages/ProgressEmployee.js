import React, { useState, useEffect } from "react";
import { getProjects } from "../api/project";
import { addProgress, getProgress } from "../api/progress";

const ProgressEmployee = () => {
  const [projects, setProjects] = useState([]);
  const [progressList, setProgressList] = useState([]);
  const [form, setForm] = useState({ projectId: "", aktivitas: "", persentase: "", foto: "" });

  useEffect(() => {
    getProjects().then(res => setProjects(res.data));
    getProgress().then(res => setProgressList(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addProgress(form);
    setForm({ projectId: "", aktivitas: "", persentase: "", foto: "" });
    const updated = await getProgress();
    setProgressList(updated.data);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Laporan Harian Proyek</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md p-4 rounded-xl mb-6">
        <select className="border p-2 rounded w-full mb-2"
          value={form.projectId}
          onChange={e => setForm({...form, projectId: e.target.value})}>
          <option value="">Pilih Proyek</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.namaProyek}</option>)}
        </select>
        <textarea
          placeholder="Aktivitas hari ini"
          className="border p-2 rounded w-full mb-2"
          value={form.aktivitas}
          onChange={e => setForm({...form, aktivitas: e.target.value})}
        />
        <input
          type="number"
          placeholder="Persentase (0-100)"
          className="border p-2 rounded w-full mb-2"
          value={form.persentase}
          onChange={e => setForm({...form, persentase: e.target.value})}
        />
        <input
          placeholder="URL Foto (opsional)"
          className="border p-2 rounded w-full mb-3"
          value={form.foto}
          onChange={e => setForm({...form, foto: e.target.value})}
        />
        <button className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700">
          Kirim Laporan
        </button>
      </form>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-2 text-gray-700">Riwayat Laporan</h2>
        <table className="w-full">
          <thead className="bg-sky-100">
            <tr>
              <th className="p-2 text-left">Proyek</th>
              <th className="p-2 text-left">Aktivitas</th>
              <th className="p-2 text-left">Persentase</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {progressList.map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-2">{p.projectId?.namaProyek}</td>
                <td className="p-2">{p.aktivitas}</td>
                <td className="p-2">{p.persentase}%</td>
                <td className="p-2">
                  {p.status === "Disetujui" ? "✅" :
                   p.status === "Ditolak" ? "❌" : "⏳ Menunggu"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ProgressEmployee;
