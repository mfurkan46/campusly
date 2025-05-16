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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: 'include', 
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


  

  return (
     <PageContainer>
      <Profile/>
    </PageContainer>
  );
}