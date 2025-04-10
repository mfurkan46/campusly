"use client"
import PageContainer from "@/components/PageContainer";
import Profile from "@/components/MyProfile";
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          credentials: 'include', // Çerezleri gönder
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Bir hata oluştu');
      }
    };
    fetchUser();
  }, []);

  if (error) return <PageContainer>
  <p className="w-full mx-auto flex items-center justify-center">Hata: {error}</p>
</PageContainer>;
  if (!user) return (
    <PageContainer>
      <p className="w-full mx-auto flex items-center justify-center">Yükleniyor...</p>
    </PageContainer>
  );
  

  return (
     <PageContainer>
      <Profile/>
    </PageContainer>
  );
}