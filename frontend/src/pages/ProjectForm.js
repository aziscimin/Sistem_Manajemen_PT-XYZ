import React, { useEffect, useState } from "react";
import { getUsers } from "../api/users";

const ProjectForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    namaProyek: "",
    lokasi: "",
    status: "Perencanaan",
    deskripsi: "",
    penanggungJawab: "",
    members: [],
  });
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    getUsers().then(res=> setUsers(res.data));
  },[]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const toggleMember = (id) => {
    setForm(prev => prev.members.includes(id)
      ? { ...prev, members: prev.members.filter(m => m !== id) }
      : { ...prev, members: [...prev.members, id] }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-3 text-sky-700">Tambah/Update Proyek</h2>
      <div className="grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="Nama Proyek"
               value={form.namaProyek} onChange={e=>setForm({...form, namaProyek:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Lokasi"
               value={form.lokasi} onChange={e=>setForm({...form, lokasi:e.target.value})}/>
        <select className="border p-2 rounded"
                value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option>Perencanaan</option>
          <option>Berjalan</option>
          <option>Selesai</option>
        </select>

        {/* Penanggung Jawab */}
        <select className="border p-2 rounded"
                value={form.penanggungJawab}
                onChange={e=>setForm({...form, penanggungJawab:e.target.value})}>
          <option value="">Pilih Penanggung Jawab</option>
          {users.map(u=> <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
        </select>

        <textarea className="border p-2 rounded col-span-2" placeholder="Deskripsi"
                  value={form.deskripsi} onChange={e=>setForm({...form, deskripsi:e.target.value})}/>
      </div>

      {/* Members checklist */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Anggota (Members):</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {users.map(u=>(
            <label key={u._id} className="flex items-center gap-2 border rounded px-2 py-1">
              <input type="checkbox"
                     checked={form.members.includes(u._id)}
                     onChange={()=>toggleMember(u._id)}
              />
              <span>{u.name} ({u.role})</span>
            </label>
          ))}
        </div>
      </div>

      <button className="bg-sky-600 text-white px-4 py-2 rounded mt-4 hover:bg-sky-700">
        Simpan
      </button>
    </form>
  );
};

export default ProjectForm;
