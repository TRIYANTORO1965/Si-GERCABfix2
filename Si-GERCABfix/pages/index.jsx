import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import JejakForm from "@/components/JejakForm";
import MainLayout from "@/components/MainLayout";

export default function Home() {
  const router = useRouter();
  const [nama, setNama] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const userNama = localStorage.getItem("nama");

    if (!role || !userNama) {
      router.push("/login");
    } else {
      setNama(userNama);
    }
  }, []);

  return (
    <MainLayout>
      
      
      <JejakForm />
    </MainLayout>
  );
}
