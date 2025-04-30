import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [nama, setNama] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      const storedNama = localStorage.getItem("nama");
      setRole(storedRole);
      setNama(storedNama);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const tabs = [
    { href: "/jejak", label: "Jejak" },
    { href: "/budaya", label: "Budaya" },
    { href: "/lapor", label: "Lapor" },
    { href: "/agenda", label: "Agenda" },
    { href: "/galeri", label: "Galeri" },
  ];

  if (role === "admin") {
    tabs.push({ href: "/dashboard", label: "Dashboard" });
  }

  return (
    <nav className="bg-yellow-50 shadow-md px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-6">
        {tabs.map((tab) => {
          const isActive = router.pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer transition ${
                  isActive
                    ? "bg-green-600 text-white shadow"
                    : "text-gray-600 hover:text-green-700"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-end gap-1">
        {role ? (
          <>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-semibold text-red-600 hover:text-red-800 rounded-full border border-red-500"
            >
              Logout
            </button>
            <p className="text-xs text-blue-500 font-medium mt-1">
              👤 login sebagai {nama}
            </p>
          </>
        ) : (
          <Link href="/login">
            <span className="px-4 py-1.5 text-sm font-semibold text-green-700 hover:text-green-800 rounded-full border border-green-600">
              Login
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
