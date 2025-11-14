import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "../components/Header";
import Card from "../components/ChartCard";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use((req) => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#6366f1"];

const LaporanKeuangan = () => {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [sumCat, setSumCat] = useState([]);
  const [form, setForm] = useState({
    tanggal: "", kategori: "Bahan", deskripsi: "", jumlah: ""
  });

  const loadProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
    if (res.data[0]) setSelected(res.data[0]._id);
  };

  // ✅ Gunakan useCallback
  const loadFinance = useCallback(async () => {
    if (!selected) return;
    const res = await API.get(`/finance?projectId=${selected}`);
    setItems(res.data.items);
    setTotal(res.data.total);
    const s = await API.get(`/finance/summary?projectId=${selected}`);
    setSumCat(s.data);
  }, [selected]);

  const addFinance = async (e) => {
    e.preventDefault();
    await API.post("/finance", { ...form, projectId: selected, jumlah: Number(form.jumlah) });
    setForm({ tanggal: "", kategori: "Bahan", deskripsi: "", jumlah: "" });
    loadFinance();
  };

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => { loadFinance(); }, [loadFinance]); // ✅ fix dependency warning

  return (
    <div>
      <Header title="Laporan Keuangan Proyek" subtitle="Input & ringkasan pengeluaran" />

      <div className="flex gap-2 items-center mb-4">
        <select className="border p-2 rounded" value={selected} onChange={e => setSelected(e.target.value)}>
          {projects.map(p => <option key={p._id} value={p._id}>{p.namaProyek}</option>)}
        </select>
        <div className="ml-auto font-semibold">Total: Rp {total.toLocaleString("id-ID")}</div>
      </div>

      <form onSubmit={addFinance} className="bg-white p-4 rounded-xl shadow mb-4 grid md:grid-cols-5 gap-3">
        <input type="date" className="border p-2 rounded" value={form.tanggal}
               onChange={e => setForm({ ...form, tanggal: e.target.value })} />
        <select className="border p-2 rounded" value={form.kategori}
                onChange={e => setForm({ ...form, kategori: e.target.value })}>
          <option>Bahan</option><option>Transportasi</option><option>Upah</option><option>Alat</option><option>Lain-lain</option>
        </select>
        <input className="border p-2 rounded" placeholder="Deskripsi" value={form.deskripsi}
               onChange={e => setForm({ ...form, deskripsi: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Jumlah" type="number" value={form.jumlah}
               onChange={e => setForm({ ...form, jumlah: e.target.value })} />
        <button className="bg-sky-600 text-white rounded px-4">Tambah</button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sky-100">
              <tr>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-left">Deskripsi</th>
                <th className="p-3 text-left">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => (
                <tr key={i._id} className="border-b">
                  <td className="p-3">{new Date(i.tanggal).toLocaleDateString("id-ID")}</td>
                  <td className="p-3">{i.kategori}</td>
                  <td className="p-3">{i.deskripsi}</td>
                  <td className="p-3">Rp {i.jumlah.toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td className="p-3" colSpan={4}>Belum ada data</td></tr>}
            </tbody>
          </table>
        </div>

        <Card title="Ringkasan per Kategori (Pie)">
          <PieChart width={420} height={280}>
            <Pie data={sumCat} dataKey="total" nameKey="kategori" outerRadius={100}>
              {sumCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        </Card>
      </div>
    </div>
  );
};

export default LaporanKeuangan;
