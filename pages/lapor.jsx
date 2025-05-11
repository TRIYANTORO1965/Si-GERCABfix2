import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import MainLayout from "../components/MainLayout";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Lapor() {
  const [form, setForm] = useState({
    nama: "",

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "laporan"), form);
      alert("Data berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan:", error);
    }
  };

    kelas: "",
    lokasi: "",
    hari: "",
    tanggal: "",
    waktu: "",
    laporan: "",
    solusi: "",


  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...data, form];
    setData(updated);
    localStorage.setItem("laporanLingkungan", JSON.stringify(updated));
    setForm({
      nama: "",
      kelas: "",
      lokasi: "",
      hari: "",
      tanggal: "",
      waktu: "",
      laporan: "",
      solusi: "",

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Nama: item.nama,
        Kelas: item.kelas,
        Lokasi: item.lokasi,
        Hari: item.hari,
        Tanggal: item.tanggal,
        Waktu: item.waktu,
        Laporan: item.laporan,
        Solusi: item.solusi,
        TindakLanjut: item.tindaklanjut ? "Sudah" : "Belum",
        Poin: item.poin
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Lingkungan");
    XLSX.writeFile(wb, "laporan_lingkungan.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Lingkungan Sekolah", 14, 16);
    autoTable(doc, {
      head: [["Nama", "Kelas", "Lokasi", "Hari", "Tanggal", "Waktu", "Laporan", "Solusi", "Tindak Lanjut", "Poin"]],
      body: data.map((item) => [
        item.nama,
        item.kelas,
        item.lokasi,
        item.hari,
        item.tanggal,
        item.waktu,
        item.laporan,
        item.solusi,
        item.tindaklanjut ? "Sudah" : "Belum",
        item.poin
      ]),
      startY: 20
    });
    doc.save("laporan_lingkungan.pdf");
  };

  return (
    <MainLayout>
      <div className="bg-glass">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Form Laporan Lingkungan</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input name="nama" value={form.nama} onChange={handleChange} className="border   rounded" placeholder="Nama Siswa" required />
          <input name="kelas" value={form.kelas} onChange={handleChange} className="border   rounded" placeholder="Kelas" required />
          <input name="lokasi" value={form.lokasi} onChange={handleChange} className="border   rounded" placeholder="Lokasi Kejadian" required />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input name="hari" value={form.hari} onChange={handleChange} className="border  rounded" placeholder="Hari" required />
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="border   rounded" required />
            <input type="time" name="waktu" value={form.waktu} onChange={handleChange} className="border   rounded" required />
          </div>
          <textarea name="laporan" value={form.laporan} onChange={handleChange} className="border p-2 rounded" rows={3} placeholder="Isi Laporan" required></textarea>
          <textarea name="solusi" value={form.solusi} onChange={handleChange} className="border p-2 rounded" rows={2} placeholder="Solusi / Tindak Lanjut yang Diusulkan" required></textarea>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="tindaklanjut" checked={form.tindaklanjut} onChange={handleChange} />
            Sudah ditindaklanjuti / diatasi? (+5 poin)
          </label>