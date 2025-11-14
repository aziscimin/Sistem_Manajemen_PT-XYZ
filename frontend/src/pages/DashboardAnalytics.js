import React, { useEffect, useState } from "react";
import API from "../api/api";
import Header from "../components/Header";
import Card from "../components/ChartCard";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

API.interceptors.request.use((req) => {
  const t = localStorage.getItem("token");
  if (t) req.headers.Authorization = `Bearer ${t}`;
  return req;
});

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#6366f1"];

const DashboardAnalytics = () => {
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState([]); // gunakan endpoint progress (admin melihat semua)

  const load = async () => {
    const p = await API.get("/projects");
    setProjects(p.data);
    const g = await API.get("/progress");
    setProgress(g.data);
  };

  useEffect(()=>{ load(); }, []);

  // Pie: Selesai vs Berjalan vs Perencanaan
  const pieData = ["Selesai", "Berjalan", "Perencanaan"].map(st => ({
    name: st,
    value: projects.filter(p => p.status === st).length
  }));

  // Bar: rata-rata persentase per proyek (dari data progress)
  const avgByProject = projects.map(pr => {
    const ps = progress.filter(pg => pg.projectId?._id === pr._id);
    const avg = ps.length ? Math.round(ps.reduce((s,i)=>s+(i.persentase||0),0)/ps.length) : 0;
    return { name: pr.namaProyek, avg };
  });

  // Line: perkembangan total progress harian (jumlah rata-rata harian)
  const byDate = {};
  progress.forEach(p=>{
    const d = new Date(p.tanggal).toISOString().slice(0,10);
    byDate[d] = (byDate[d] || 0) + (p.persentase || 0);
  });
  const lineData = Object.entries(byDate).sort((a,b)=>a[0].localeCompare(b[0])).map(([date,val])=>({ date, total: val }));

  const exportExcel = () => {
    const sheet1 = XLSX.utils.json_to_sheet(projects);
    const sheet2 = XLSX.utils.json_to_sheet(progress);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet1, "Projects");
    XLSX.utils.book_append_sheet(wb, sheet2, "Progress");
    XLSX.writeFile(wb, "laporan-proyek.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Proyek", 14, 16);
    const rows = projects.map(p=>[p.namaProyek, p.lokasi, p.status, p.penanggungJawab?.name || "-"]);
    doc.autoTable({ head: [["Nama Proyek","Lokasi","Status","Penanggung Jawab"]], body: rows, startY: 20 });
    doc.save("laporan-proyek.pdf");
  };

  return (
    <div>
      <Header title="Dashboard Analitik" subtitle="Progress proyek & ringkasan performa" />
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Status Proyek (Pie)">
          <PieChart width={380} height={260}>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90}>
              {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        </Card>

        <Card title="Rata-rata Progress per Proyek (Bar)">
          <BarChart width={420} height={260} data={avgByProject}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avg" />
          </BarChart>
        </Card>

        <Card title="Perkembangan Progress Harian (Line)">
          <LineChart width={820} height={260} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" dot={false}/>
          </LineChart>
        </Card>

        <Card title="Export">
          <div className="flex gap-3">
            <button onClick={exportExcel} className="bg-emerald-600 text-white px-4 py-2 rounded">Export Excel</button>
            <button onClick={exportPDF} className="bg-indigo-600 text-white px-4 py-2 rounded">Export PDF</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
