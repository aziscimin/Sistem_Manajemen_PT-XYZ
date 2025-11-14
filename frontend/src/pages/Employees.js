import React, { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUserApi } from "../api/users";

const Employees = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "karyawan" });
  const [editing, setEditing] = useState(null);

  const fetchUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateUser(editing, { ...form, password: form.password || undefined });
    } else {
      await createUser(form);
    }
    setForm({ name: "", email: "", password: "", role: "karyawan" });
    setEditing(null);
    fetchUsers();
  };

  const onEdit = (u) => {
    setEditing(u._id);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
  };

  const onDelete = async (id) => {
    if (window.confirm("Hapus user ini?")) {
      await deleteUserApi(id);
      fetchUsers();
    }
  };

  return (
    <div className="p-6 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-slate-700">Manajemen Karyawan</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="Nama"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="border p-2 rounded" placeholder="Email" type="email"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="border p-2 rounded" placeholder={editing ? "Password (kosongkan jika tdk ganti)" : "Password"} type="password"
               value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <select className="border p-2 rounded"
                value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="karyawan">Karyawan</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-sky-600 text-white rounded px-4 py-2 col-span-2 hover:bg-sky-700">
          {editing ? "Update" : "Tambah"} User
        </button>
      </form>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-slate-200">
          <tr>
            <th className="p-3 text-left">Nama</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=>(
            <tr key={u._id} className="border-b hover:bg-slate-50">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 text-center space-x-3">
                <button onClick={()=>onEdit(u)} className="text-sky-600 hover:underline">Edit</button>
                <button onClick={()=>onDelete(u._id)} className="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
