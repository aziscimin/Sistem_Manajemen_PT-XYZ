import React, { useState } from "react";
import axios from "axios";

const FileUploader = ({ projectId = null, progressId = null, onUploaded, type = "absen" }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = axios.create({ baseURL: "http://localhost:5000/api/files" });
  API.interceptors.request.use((req) => {
    const t = localStorage.getItem("token");
    if (t) req.headers.Authorization = `Bearer ${t}`;
    return req;
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file);
      if (projectId) form.append("projectId", projectId);
      if (progressId) form.append("progressId", progressId);
      form.append("type", type); // 🆕 wajib dikirim ke backend

      await API.post("/", form);
      alert("✅ File berhasil diupload!");

      setFile(null);
      onUploaded?.();
    } catch (err) {
      console.error(err);
      alert("❌ Gagal upload file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow-md"
    >
      <input
        type="file"
        accept="image/*,application/pdf" // 🆕 hanya foto & PDF
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded w-64"
      />
      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"
        }`}
      >
        {loading ? "Mengunggah..." : "Upload"}
      </button>
    </form>
  );
};

export default FileUploader;
