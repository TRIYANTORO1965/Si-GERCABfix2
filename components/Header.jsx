import Image from "next/image";

export default function Header() {
  return (
    <div className="text-center mb-6 bg-green-100 py-4 ">
      <div className="flex justify-center items-center gap-4">
        <Image
          src="/logoku.png"
          alt="Logo GERCAB"
          width={80}
          height={80}
          className="rounded-full"
          priority
        />
        <div className="text-left leading-tight">
          <h1 className="text-4xl font-bold tracking-wide">
            <span
              className="text-2xl italic text-red-600 align-super mr-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Si
            </span>
            <span
              className="text-5xl font-extrabold text-green-800 tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              GERCAB
            </span>
          </h1>
          <p className="text-sm text-black leading-snug font-medium">
            Gerakan Cinta Alam dan Budaya
          </p>
          <p
            className="text-lg font-mediumbold mt-1"
            style={{ color: "#1e3a8a" }}
          >
            SMP NEGERI 2 KAYEN
          </p>
          <p className="text-xs italic text-gray-400 mt-1">By: @Mr.Tri25</p>
        </div>
      </div>
    </div>
  );
}
