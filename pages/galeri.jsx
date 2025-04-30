import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";

export default function Galeri() {
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    deskripsi: "",
    file: null,
    tanggal: new Date().toISOString().slice(0, 10),
    poin: 5,
  });

  const [totalPoin, setTotalPoin] = useState(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("galeriMedia")) || [];
    setMedia(stored);
    const total = stored.reduce((sum, item) => sum + (item.poin || 0), 0);
    setTotalPoin(total);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, file: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

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
      file: null,
      tanggal: new Date().toISOString().slice(0, 10),
      poin: 5,
    });

    const newTotal = updated.reduce((sum, item) => sum + (item.poin || 0), 0);
    setTotalPoin(newTotal);
  };

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
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} className=" " required />
          <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="border  rounded" />
          <button type="submit" className="bg-pink-600 text-white py-2 rounded hover:bg-green-700">
            Unggah Dokumentasi (+{form.poin} poin)
          </button>
        </form>

        <p className="text-sm text-green-700 font-semibold mb-6">
          Total Poin Dokumentasi: <span className="text-green-900">{totalPoin}</span>
        </p>

        {media.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {media.map((item, i) => (
              <div key={i} className="border rounded shadow p-2 bg-white">
                <p className="text-sm font-semibold text-pink-700">{item.deskripsi}</p>
                <p className="text-xs text-gray-500">📅 {item.tanggal} | ⭐ {item.poin} poin</p>
                <p className="text-xs text-gray-500">👤 {item.nama} ({item.kelas})</p>
                {item.file.startsWith("data:video") ? (
                  <video controls className="w-full rounded mt-2">
                    <source src={item.file} />
                  </video>
                ) : (
                  <img src={item.file} alt="galeri" className="w-full h-48 object-cover rounded mt-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-blue-500">Belum ada dokumentasi yang diunggah.</p>
        )}
      </div>
    </MainLayout>
  );
}
