"use client";
import { useState, useEffect } from "react";
import Content from "@/components/Content";

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include", 
        });

        if (!response.ok) {
          throw new Error("Kullanıcı alınamadı");
        }

        const data = await response.json();
        setCurrentUserId(data.id); 
      } catch (error) {
        setCurrentUserId(null); 
      }
    };

    fetchUser();
  }, []); 

  return (
    <div className="md:min-w-[90%] max-w-3xl sm:px-2 mx-auto">
      <div className="pt-4 pb-[-32px] flex-1 mx-2 md:ml-[16.66%] md:mr-[16.66%] overflow-y-auto">
        <Content currentUserId={currentUserId} />
      </div>
    </div>
  );
}