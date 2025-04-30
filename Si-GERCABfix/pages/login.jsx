import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ nama: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) router.replace("/");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nama, username, password } = form;

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("nama", nama || "Admin");
      localStorage.setItem("loginUser", JSON.stringify({ nama, role: "admin" }));
      router.replace("/");
    } else if (username === "siswa" && password === "siswa123") {
      localStorage.setItem("role", "siswa");
      localStorage.setItem("nama", nama || "Siswa");
      localStorage.setItem("loginUser", JSON.stringify({ nama, role: "siswa" }));
      router.replace("/");
    } else {
      setError("Username atau password salah.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-blue-100 shadow-lg rounded-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Image src="/logoku.png" alt="Logo GERCAB" width={40} height={40} className="rounded-full" />
          <h2 className="text-2xl font-bold text-green-700 flex items-end gap-1">
            <span className="text-red-600 italic text-xl align-super" style={{ fontFamily: "Georgia, serif" }}>Si</span>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="tracking-widest">GERCAB</span>
          </h2>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid gap-4 text-left">
          <input name="nama" type="text" value={form.nama} onChange={handleChange} className="border p-2 rounded" placeholder="Nama Lengkap" required />
          <input name="username" type="text" value={form.username} onChange={handleChange} className="border p-2 rounded" placeholder="Username" required />
          <div className="relative">
            <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} className="border p-2 rounded w-full" placeholder="Password" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 text-sm text-gray-600 hover:text-gray-800">
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Login</button>
        </form>
      </div>

      <p className="absolute bottom-2 left-2 text-xs italic text-gray-500">
        Aplikasi ini dibuat oleh <strong>@Mr.Tri25</strong>
      </p>
    </div>
  );
}
