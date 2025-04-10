"use client"; // İstemci tarafında çalışacağını belirtmek için
import { useState, useEffect } from "react";
import Content from "@/components/Content";

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          credentials: "include", // Çerezleri (örneğin JWT) göndermek için
        });

        if (!response.ok) {
          throw new Error("Kullanıcı alınamadı");
        }

        const data = await response.json();
        setCurrentUserId(data.id); // Kullanıcı ID'sini state'e kaydediyoruz
      } catch (error) {
        console.error("Kullanıcı alınamadı:", error);
        setCurrentUserId(null); // Hata durumunda null bırakabiliriz
      }
    };

    fetchUser();
  }, []); // Boş dependency array ile sadece bir kere çalışır

  return (
    <div className="md:min-w-[90%] max-w-3xl sm:px-2 mx-auto">
      <div className="pt-4 h-screen flex-1 mx-2 md:ml-[16.66%] md:mr-[16.66%] overflow-y-auto max-h-[calc(100vh-30px)] md:max-h-[calc(100vh-75px)]">
        <Content currentUserId={currentUserId} /> {/* currentUserId prop olarak geçiyor */}
      </div>
    </div>
  );
}