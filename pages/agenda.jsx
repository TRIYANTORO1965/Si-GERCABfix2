// ======= agenda.jsx FINAL: versi aman, upload dibatasi 2MB, semua fitur jalan tanpa error =======
import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";

export default function Agenda() {
  const [agendaList, setAgendaList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [form, setForm] = useState({ tanggal: "", judul: "", deskripsi: "", dokumentasi: null });
  const [editIndex, setEditIndex] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("agendaLingkungan")) || [];
      setAgendaList(saved);
      const login = JSON.parse(localStorage.getItem("loginUser"));
      setUser(login);
    }
  }, []);

  useEffect(() => {
    let data = [...agendaList];
    if (bulan) {
      data = data.filter((item) => new Date(item.tanggal).getMonth() + 1 === parseInt(bulan));
    }
    if (tahun) {
      data = data.filter((item) => new Date(item.tanggal).getFullYear() === parseInt(tahun));
    }
    setFiltered(data);
  }, [bulan, tahun, agendaList]);

  const semuaTahun = [...new Set(agendaList.map((a) => new Date(a.tanggal).getFullYear()))];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, dokumentasi: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...agendaList];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }
    setAgendaList(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("agendaLingkungan", JSON.stringify(updated));
    }
    setForm({ tanggal: "", judul: "", deskripsi: "", dokumentasi: null });
    setEditIndex(null);
  };

  const handleEdit = (i) => {
    setForm(agendaList[i]);
    setEditIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (i) => {
    if (confirm("Yakin ingin menghapus agenda ini?")) {
      const updated = agendaList.filter((_, index) => index !== i);
      setAgendaList(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("agendaLingkungan", JSON.stringify(updated));
      }
    }
  };

  const formatTanggal = (tgl) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(tgl).toLocaleDateString("id-ID", options);
  };

  const getBulanTahunSekarang = () => {
    const now = new Date();
    const namaBulan = now.toLocaleString("id-ID", { month: "long" });
    const tahunSekarang = now.getFullYear();
    return `${namaBulan} ${tahunSekarang}`;
  };

  const renderKalender = () => {
    const highlightDates = agendaList.map((a) => new Date(a.tanggal).getDate());
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return (
      <div className="grid grid-cols-7 gap-2 text-center text-sm mb-6">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const isAgenda = highlightDates.includes(day);
          return (
            <div key={i} className={`p-2 rounded ${isAgenda ? "bg-yellow-300 text-white font-bold" : "bg-gray-100"}`}>
              {day}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="bg-glass">
        <h2 className="text-xl font-semibold mb-6 text-green-700">📅 Agenda Kegiatan Lingkungan dan Budaya</h2>

        {/* Kalender interaktif */}
        <div className="mb-8">
          <h3 className="text-md font-semibold text-green-600 mb-2">🗓️ Kalender {getBulanTahunSekarang()}</h3>
          {renderKalender()}
        </div>

        {/* Form Tambah/Edit Agenda */}
        {user?.role === "admin" && (
          <form onSubmit={handleSubmit} className="space-y-3 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleFormChange}
                className="border p-2 rounded"
                placeholder="Judul Kegiatan"
                required
              />
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleFormChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="deskripsi"
                value={form.deskripsi}
                onChange={handleFormChange}
                className="border p-2 rounded col-span-2"
                placeholder="Deskripsi Singkat"
                required
              />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="border p-2 rounded col-span-2"
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              {editIndex !== null ? "💾 Simpan Perubahan" : "➕ Tambah Agenda"}
            </button>
          </form>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          <select onChange={(e) => setBulan(e.target.value)} value={bulan} className="border p-2 rounded">
            <option value="">🌙 Semua Bulan</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>
          <select onChange={(e) => setTahun(e.target.value)} value={tahun} className="border p-2 rounded">
            <option value="">📅 Semua Tahun</option>
            {semuaTahun.map((th) => (
              <option key={th} value={th}>{th}</option>
            ))}
          </select>
        </div>

        {/* List Agenda */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map((agenda, i) => (
              <div key={i} className="bg-white border border-green-100 shadow-lg rounded-lg p-4 hover:shadow-xl transition">
                <p className="text-xs text-gray-500">{formatTanggal(agenda.tanggal)}</p>
                <h3 className="text-lg font-bold text-green-800 mb-2">{agenda.judul}</h3>
                <p className="text-sm text-gray-700">{agenda.deskripsi}</p>
                {agenda.dokumentasi && (
                  <div className="mt-3">
                    {agenda.dokumentasi.startsWith("data:video") ? (
                      <video controls className="rounded w-full">
                        <source src={agenda.dokumentasi} />
                      </video>
                    ) : (
                      <img src={agenda.dokumentasi} alt="Dokumentasi" className="rounded w-full h-48 object-cover" />
                    )}
                  </div>
                )}
                {user?.role === "admin" && (
                  <div className="flex justify-end gap-2 mt-4">
                    <button onClick={() => handleEdit(i)} className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                    <button onClick={() => handleDelete(i)} className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600">Hapus</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">Tidak ada agenda untuk filter yang dipilih.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
