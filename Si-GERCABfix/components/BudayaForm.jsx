"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "chart.js/auto";

const aksiBudaya = {
  "Apresiasi dan Ekspresi Seni Budaya": [
    { aksi: "Pentas Seni Rutin", poin: 5 },
    { aksi: "Ekstrakurikuler Seni Aktif", poin: 4 },
    { aksi: "Workshop dan Kelas Seni", poin: 6 },
    { aksi: "Pameran Karya Seni Siswa", poin: 5 },
    { aksi: "Festival Seni dan Budaya Sekolah", poin: 7 },
  ],
  "Pelestarian dan Pemahaman Warisan Budaya": [
    { aksi: "Klub Sejarah dan Budaya", poin: 4 },
    { aksi: "Kunjungan ke Situs Budaya", poin: 6 },
    { aksi: "Narasumber Budaya", poin: 5 },
    { aksi: "Proyek Penelitian Budaya Lokal", poin: 7 },
    { aksi: "Dokumentasi Budaya", poin: 5 },
  ],
  "Penggunaan Bahasa dan Literasi Budaya": [
    { aksi: "Hari Bahasa Daerah", poin: 4 },
    { aksi: "Lomba Cipta Puisi dan Cerpen", poin: 5 },
    { aksi: "Klub Literasi Budaya", poin: 4 },
    { aksi: "Pojok Baca Budaya", poin: 3 },
    { aksi: "Mendongeng atau Bercerita", poin: 4 },
  ],
  "Pengamalan Nilai-Nilai Luhur Budaya": [
    { aksi: "Kegiatan Gotong Royong", poin: 5 },
    { aksi: "Program Mentoring", poin: 4 },
    { aksi: "Kampanye Kesopanan", poin: 3 },
    { aksi: "Pembelajaran Berbasis Kearifan Lokal", poin: 5 },
    { aksi: "Program Toleransi dan Keberagaman", poin: 6 },
  ],
  "Adaptasi dan Inovasi Budaya": [
    { aksi: "Mengintegrasikan Teknologi dalam Pelestarian Budaya", poin: 6 },
    { aksi: "Kreasi Seni Budaya Kontemporer", poin: 5 },
    { aksi: "Proyek Kewirausahaan Berbasis Budaya", poin: 6 },
    { aksi: "Kolaborasi dengan Komunitas Budaya", poin: 5 },
    { aksi: "Festival Budaya Digital", poin: 7 },
  ],
};

export default function BudayaForm() {
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    kategori: "",
    aksi: "",
    lokasi: "",
    tanggal: "",
    dokumentasi: null,
    poin: 0,
  });

  const [data, setData] = useState([]);
  const [totalPoin, setTotalPoin] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("budayaHijau")) || [];
    setData(saved);
    setTotalPoin(saved.reduce((sum, d) => sum + d.poin, 0));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "kategori") {
      setForm({ ...form, kategori: value, aksi: "", poin: 0 });
    } else if (name === "aksi") {
      const aksiDipilih = aksiBudaya[form.kategori]?.find((a) => a.aksi === value);
      setForm({ ...form, aksi: value, poin: aksiDipilih?.poin || 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setForm({ ...form, dokumentasi: e.target.files?.[0] || null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...data, form];
    setData(updated);
    setTotalPoin(totalPoin + form.poin);
    localStorage.setItem("budayaHijau", JSON.stringify(updated));
    setForm({ nama: "", kelas: "", kategori: "", aksi: "", lokasi: "", tanggal: "", dokumentasi: null, poin: 0 });
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.map(d => ({
      ...d,
      dokumentasi: d.dokumentasi?.name || ""
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Budaya Hijau");
    XLSX.writeFile(wb, "budaya_hijau.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Budaya Hijau", 14, 16);
    autoTable(doc, {
      head: [["Nama", "Kelas", "Kategori", "Aksi", "Lokasi", "Tanggal", "Poin"]],
      body: data.map(d => [d.nama, d.kelas, d.kategori, d.aksi, d.lokasi, d.tanggal, d.poin])
    });
    doc.save("budaya_hijau.pdf");
  };

  const chart = {
    labels: data.map(d => d.nama),
    datasets: [{
      label: "Poin Budaya per Siswa",
      data: data.map(d => d.poin),
      backgroundColor: "rgba(244,114,182,0.6)"
    }]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="grid gap-4" onSubmit={handleSubmit}>
        <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className="form-control w-full border  rounded" required />
        <input name="kelas" placeholder="Kelas" value={form.kelas} onChange={handleChange} className="border  rounded" required />
        <select name="kategori" value={form.kategori} onChange={handleChange} className="border  rounded" required>
          <option value="">Pilih Kategori Budaya</option>
          {Object.keys(aksiBudaya).map((kat) => (
            <option key={kat} value={kat}>{kat}</option>
          ))}
        </select>
        {form.kategori && (
          <select name="aksi" value={form.aksi} onChange={handleChange} className="border rounded" required>
            <option value="">Pilih Aksi Budaya</option>
            {aksiBudaya[form.kategori].map((a) => (
              <option key={a.aksi} value={a.aksi}>{a.aksi}</option>
            ))}
          </select>
        )}
        <input name="lokasi" placeholder="Lokasi" value={form.lokasi} onChange={handleChange} className="border  rounded" required />
        <input name="tanggal" type="date" value={form.tanggal} onChange={handleChange} className="border  rounded" required />
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="" />
        <input type="number" readOnly value={form.poin} className="border rounded bg-gray-100" placeholder="Poin Otomatis" />
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-pink-700 transition">Simpan Budaya</button>
      </form>

      <div className="flex gap-4 mt-4 justify-center">
        <button onClick={exportExcel} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Export Excel</button>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Export PDF</button>
      </div>

      <p className="mt-4 text-sm text-center">Total Poin Budaya: <span className="font-bold text-pink-700">{totalPoin}</span></p>

      {data.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Grafik Poin Budaya</h3>
          <Bar data={chart} />
        </div>
      )}
    </div>
  );
}