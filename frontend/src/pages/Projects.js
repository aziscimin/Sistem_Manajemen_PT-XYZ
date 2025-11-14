import React, { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "../api/project";
import { getProgress } from "../api/progress"; // ✅ ambil progress juga
import API from "../api/api";
import ProjectForm from "./ProjectForm";
import Header from "../components/Header";
import DetailProyek from "./DetailProyek";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [progressData, setProgressData] = useState([]); // ✅ simpan progress
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    namaProyek: "",
    lokasi: "",
    status: "Perencanaan",
  });

  // Ambil data proyek dan progress
  const fetchData = async () => {
    const [resProyek, resProgress] = await Promise.all([
      getProjects(),
      getProgress(),
    ]);
    setProjects(resProyek.data);
    setProgressData(resProgress.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tambah proyek
  const handleAdd = async (data) => {
    await createProject(data);
    setShowForm(false);
    fetchData();
  };

  // Hapus proyek
  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus proyek ini?")) {
      await deleteProject(id);
      fetchData();
    }
  };

  // Klik proyek untuk buka detail popup
  const handleShowDetail = (project) => {
    setSelectedProject(project);
    setIsEditing(false);
    setEditData({
      namaProyek: project.namaProyek,
      lokasi: project.lokasi,
      status: project.status || "Perencanaan",
    });
  };

  // ✅ Update proyek
  const handleUpdate = async () => {
    try {
      await API.put(`/projects/${selectedProject._id}`, editData);
      alert("✅ Proyek berhasil diperbarui!");
      setIsEditing(false);
      setSelectedProject({ ...selectedProject, ...editData });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal memperbarui proyek");
    }
  };

  // ✅ Fungsi cari progress terbaru per proyek
  const getLastActivity = (projectId) => {
    const logs = progressData.filter((p) => p.projectId?._id === projectId);
    if (logs.length === 0) return "-";
    const latest = logs.sort(
      (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
    )[0];
    return `${latest.aktivitas} (${new Date(latest.tanggal).toLocaleDateString()})`;
  };

  if (loading) return <div className="p-4">Memuat...</div>;

  return (
    <div>
      <Header title="Data Proyek" subtitle="Daftar proyek & aktivitas terakhir" />

      {/* Tombol Tambah Proyek */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-sky-600 text-white px-4 py-2 rounded mb-4 hover:bg-sky-700 transition"
      >
        {showForm ? "Tutup Form" : "Tambah Proyek"}
      </button>

      {showForm && <ProjectForm onSubmit={handleAdd} />}

      {/* ===== Tabel Proyek ===== */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <thead className="bg-sky-100">
            <tr>
              <th className="p-3 text-left">Nama Proyek</th>
              <th className="p-3 text-left">Lokasi</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Penanggung Jawab</th>
              <th className="p-3 text-left">Aktivitas Terakhir</th> {/* ✅ baru */}
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p._id}
                className="border-b hover:bg-slate-50 cursor-pointer transition"
                onClick={() => handleShowDetail(p)}
              >
                <td className="p-3">{p.namaProyek}</td>
                <td className="p-3">{p.lokasi}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">{p.penanggungJawab?.name || "-"}</td>
                <td className="p-3 text-gray-600 italic">
                  {getLastActivity(p._id)}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(p._id);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== Popup Detail Proyek ===== */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            {!isEditing ? (
              <>
                <DetailProyek projectIdFromProp={selectedProject._id} />
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    ✏️ Edit Proyek
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  Edit Proyek: {selectedProject.namaProyek}
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Nama Proyek
                    </label>
                    <input
                      className="border p-2 rounded w-full"
                      value={editData.namaProyek}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          namaProyek: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Lokasi
                    </label>
                    <input
                      className="border p-2 rounded w-full"
                      value={editData.lokasi}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          lokasi: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Status
                    </label>
                    <select
                      className="border p-2 rounded w-full"
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Perencanaan">Perencanaan</option>
                      <option value="Berjalan">Berjalan</option>
                      <option value="Tertunda">Tertunda</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button
                    onClick={handleUpdate}
                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                  >
                    💾 Simpan
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    ❌ Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
