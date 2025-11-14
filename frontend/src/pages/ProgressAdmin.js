import React, { useEffect, useState } from "react";
import { getProgress, updateProgressStatus } from "../api/progress";

const ProgressAdmin = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const res = await getProgress();
    setData(res.data);
  };
  useEffect(() => { fetchData(); }, []);

  const handleUpdate = async (id, status) => {
    await updateProgressStatus(id, { status });
    fetchData();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-sky-700">Monitoring Laporan Proyek</h1>
      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-sky-100">
          <tr>
            <th className="p-3 text-left">Tanggal</th>
            <th className="p-3 text-left">Proyek</th>
            <th className="p-3 text-left">Karyawan</th>
            <th className="p-3 text-left">Aktivitas</th>
            <th className="p-3 text-left">Persentase</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p._id} className="border-b hover:bg-slate-50">
              <td className="p-3">{new Date(p.tanggal).toLocaleDateString()}</td>
              <td className="p-3">{p.projectId?.namaProyek}</td>
              <td className="p-3">{p.userId?.name}</td>
              <td className="p-3">{p.aktivitas}</td>
              <td className="p-3">{p.persentase}%</td>
              <td className="p-3">{p.status}</td>
              <td className="p-3 text-center space-x-2">
                <button onClick={() => handleUpdate(p._id, "Disetujui")} className="text-green-600 hover:underline">Setuju</button>
                <button onClick={() => handleUpdate(p._id, "Ditolak")} className="text-red-600 hover:underline">Tolak</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ProgressAdmin;
