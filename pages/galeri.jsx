import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";

export default function Galeri() {
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    deskripsi: "",

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.file) return;

    const newItem = { ...form };
    const updated = [...media, newItem];
    setMedia(updated);
    localStorage.setItem("galeriMedia", JSON.stringify(updated));

    setForm({
      nama: "",
      kelas: "",
      deskripsi: "",

  return (
    <MainLayout>
      <div className="bg-glass">
        <h2 className="text-xl font-semibold text-green-600 mb-4">Dokumentasi Lingkungan & Budaya</h2>

        <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
          <input
            name="nama"
            value={form.nama}
            onChange={handleChange}
            placeholder="Nama Siswa"
            className="border   rounded"
            required
          />
          <input
            name="kelas"
            value={form.kelas}
            onChange={handleChange}
            placeholder="Kelas"
            className="border   rounded"
            required
          />
          <input
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            placeholder="Deskripsi / Judul Dokumentasi"
            className="border p-6 rounded"
            required
          />