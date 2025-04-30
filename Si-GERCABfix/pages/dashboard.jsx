import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Dashboard() {
  const [rekap, setRekap] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");

  useEffect(() => {
    const jejak = JSON.parse(localStorage.getItem("jejakHijau")) || [];
    const budaya = JSON.parse(localStorage.getItem("budayaHijau")) || [];
    const laporan = JSON.parse(localStorage.getItem("laporanLingkungan")) || [];
    const galeri = JSON.parse(localStorage.getItem("galeriMedia")) || [];

    const galeriData = galeri.map(item => ({
      nama: item.nama,
      kelas: item.kelas,
      tanggal: item.tanggal,
      kategori: "Galeri",
      aksi: item.deskripsi,
      lokasi: "-",
      poin: item.poin || 5
    }));

    const semuaData = [...jejak, ...budaya, ...laporan, ...galeriData];
    const rekapMap = {};
    const detailMap = {};

    semuaData.forEach((item) => {
      const key = item.nama + "-" + item.kelas;
      if (!rekapMap[key]) {
        rekapMap[key] = {
          nama: item.nama,
          kelas: item.kelas,
          totalPoin: 0,
          jumlahAksi: 0,
        };
        detailMap[key] = [];
      }
      rekapMap[key].totalPoin += item.poin || 0;
      rekapMap[key].jumlahAksi += 1;
      detailMap[key].push(item);
    });

    setRekap(Object.values(rekapMap).sort((a, b) => b.totalPoin - a.totalPoin));
    setDetailData(detailMap);
  }, []);

  const toggleExpand = (key) => {
    setExpanded(expanded === key ? null : key);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      rekap.map((item) => ({
        Nama: item.nama,
        Kelas: item.kelas,
        "Jumlah Aksi": item.jumlahAksi,
        "Total Poin": item.totalPoin,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rekap Poin Siswa");
    XLSX.writeFile(wb, "rekap_poin_siswa.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Rekap Poin Semua Aksi Siswa", 14, 16);
    autoTable(doc, {
      head: [["No", "Nama", "Kelas", "Jumlah Aksi", "Total Poin"]],
      body: rekap.map((item, i) => [
        i + 1,
        item.nama,
        item.kelas,
        item.jumlahAksi,
        item.totalPoin,
      ]),
      startY: 20,
    });
    doc.save("rekap_poin_siswa.pdf");
  };

  const filteredRekap = rekap.filter((item) => {
    const cocokNama = item.nama.toLowerCase().includes(search.toLowerCase());
    const cocokKelas = kelasFilter ? item.kelas === kelasFilter : true;
    return cocokNama && cocokKelas;
  });

  return (
    <MainLayout>
      <div className="bg-glass">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Dashboard Rekap Semua Aksi Siswa</h2>

        {/* Top 10 */}
        {rekap.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-600 mb-2">🏆 Top 10 Siswa Berdasarkan Poin</h3>
            <table className="w-full md:w-2/3 table-auto text-sm border bg-white shadow rounded overflow-hidden">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="px-3 py-2 border">#</th>
                  <th className="px-3 py-2 border">Nama</th>
                  <th className="px-3 py-2 border">Kelas</th>
                  <th className="px-3 py-2 border text-center">Poin</th>
                </tr>
              </thead>
              <tbody>
                {rekap
                  .sort((a, b) => b.totalPoin - a.totalPoin)
                  .slice(0, 10)
                  .map((item, idx) => (
                    <tr key={idx} className="hover:bg-yellow-50">
                      <td className="px-3 py-2 border text-center font-semibold">{idx + 1}</td>
                      <td className="px-3 py-2 border">{item.nama}</td>
                      <td className="px-3 py-2 border">{item.kelas}</td>
                      <td className="px-3 py-2 border text-center">{item.totalPoin}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            placeholder="🔍 Cari nama siswa..."
            className="border px-3 py-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
          >
            <option value="">🎓 Semua Kelas</option>
            {Array.from(new Set(rekap.map((r) => r.kelas))).map((kelas, i) => (
              <option key={i} value={kelas}>{kelas}</option>
            ))}
          </select>
          <select
            className="border px-3 py-2 rounded"
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
          >
            <option value="">🗂️ Semua Kategori</option>
            <option value="Jejak">Jejak</option>
            <option value="Budaya">Budaya</option>
            <option value="Laporan">Laporan</option>
            <option value="Galeri">Galeri</option>
          </select>
        </div>

        <div className="flex gap-4 mb-6 justify-center">
          <button onClick={exportExcel} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
            Export Excel
          </button>
          <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Export PDF
          </button>
        </div>

        <table className="w-full table-auto border text-sm shadow bg-white">
          <thead className="bg-indigo-100 text-left">
            <tr>
              <th className="px-3 py-2 border"></th>
              <th className="px-3 py-2 border">Nama</th>
              <th className="px-3 py-2 border">Kelas</th>
              <th className="px-3 py-2 border text-center">Jumlah Aksi</th>
              <th className="px-3 py-2 border text-center">Total Poin</th>
            </tr>
          </thead>
          <tbody>
            {filteredRekap.length > 0 ? (
              filteredRekap.map((item) => {
                const key = item.nama + "-" + item.kelas;
                const detailAksi = detailData[key] || [];
                const filteredDetail = kategoriFilter
                  ? detailAksi.filter((a) => (a.kategori || "Laporan") === kategoriFilter)
                  : detailAksi;

                return (
                  <React.Fragment key={key}>
                    <tr className="hover:bg-indigo-50">
                      <td className="px-3 py-2 border text-center">
                        <button
                          onClick={() => toggleExpand(key)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition duration-200 ${
                            expanded === key
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {expanded === key ? "Tutup" : "Detail"}
                        </button>
                      </td>
                      <td className="px-3 py-2 border">{item.nama}</td>
                      <td className="px-3 py-2 border">{item.kelas}</td>
                      <td className="px-3 py-2 border text-center">{filteredDetail.length}</td>
                      <td className="px-3 py-2 border text-center font-semibold">
                        {filteredDetail.reduce((sum, d) => sum + (d.poin || 0), 0)}
                      </td>
                    </tr>
                    {expanded === key && (
                      <tr className="bg-indigo-50">
                        <td colSpan="5" className="px-3 py-2 border">
                          <table className="w-full text-sm mb-2">
                            <thead>
                              <tr className="text-gray-700">
                                <th className="text-left px-2 py-1">Tanggal</th>
                                <th className="text-left px-2 py-1">Kategori</th>
                                <th className="text-left px-2 py-1">Aksi / Laporan</th>
                                <th className="text-left px-2 py-1">Lokasi</th>
                                <th className="text-left px-2 py-1">Poin</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredDetail.map((aksi, idx) => (
                                <tr key={idx}>
                                  <td className="px-2 py-1">{aksi.tanggal || "-"}</td>
                                  <td className="px-2 py-1">{aksi.kategori || "Laporan"}</td>
                                  <td className="px-2 py-1">{aksi.aksi || aksi.laporan || aksi.deskripsi}</td>
                                  <td className="px-2 py-1">{aksi.lokasi || "-"}</td>
                                  <td className="px-2 py-1">{aksi.poin}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                const doc = new jsPDF();
                                doc.text(`Laporan Detail Aksi - ${item.nama}`, 14, 16);
                                autoTable(doc, {
                                  head: [["Tanggal", "Kategori", "Aksi / Laporan", "Lokasi", "Poin"]],
                                  body: filteredDetail.map((d) => [
                                    d.tanggal || "-",
                                    d.kategori || "Laporan",
                                    d.aksi || d.laporan || d.deskripsi,
                                    d.lokasi || "-",
                                    d.poin || 0,
                                  ]),
                                  startY: 20,
                                });
                                doc.save(`laporan_${item.nama.toLowerCase().replace(/\s+/g, "_")}.pdf`);
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                            >
                              Export Detail PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="px-3 py-4 text-center text-gray-500">
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}
