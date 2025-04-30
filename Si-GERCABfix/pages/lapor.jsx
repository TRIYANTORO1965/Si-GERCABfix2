import { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Lapor() {
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    lokasi: "",
    hari: "",
    tanggal: "",
    waktu: "",
    laporan: "",
    solusi: "",
    dokumentasi: null,
    tindaklanjut: false,
    poin: 0
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("laporanLingkungan")) || [];
    setData(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const nilaiPoin = checked ? 5 : 0;
      setForm((prev) => ({ ...prev, tindaklanjut: checked, poin: nilaiPoin }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, dokumentasi: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
      dokumentasi: null,
      tindaklanjut: false,
      poin: 0
    });
  };

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
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-pink-700">Kirim Laporan</button>
        </form>

        {data.length > 0 && (
          <>
            <div className="flex gap-4 mt-6 justify-center">
              <button onClick={exportExcel} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Export Excel</button>
              <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Export PDF</button>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Laporan Masuk:</h3>
              <ul className="space-y-4 text-sm">
                {data.map((item, i) => (
                  <li key={i} className="bg-green-50 border p-3 rounded shadow">
                    <p><strong>{item.nama} ({item.kelas})</strong> - <em>{item.lokasi}</em></p>
                    <p><span className="font-semibold">Waktu:</span> {item.hari}, {item.tanggal} - {item.waktu}</p>
                    <p><span className="font-semibold">Laporan:</span> {item.laporan}</p>
                    <p><span className="font-semibold">Solusi:</span> {item.solusi}</p>
                    {item.tindaklanjut && <p className="text-green-700 font-medium">✅ Sudah ditindaklanjuti (+5 poin)</p>}
                    <p className="font-semibold">Poin: {item.poin}</p>
                    {item.dokumentasi && (
                      <div className="mt-2">
                        {item.dokumentasi.startsWith("data:video") ? (
                          <video controls className="w-full rounded">
                            <source src={item.dokumentasi} />
                          </video>
                        ) : (
                          <img src={item.dokumentasi} alt="dokumentasi" className="w-full h-52 object-cover rounded" />
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
