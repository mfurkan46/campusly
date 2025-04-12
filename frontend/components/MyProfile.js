"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiCalendar, FiMapPin, FiLink } from "react-icons/fi";
import Post from "../components/Post";
import ProfileEditModal from "./ProfileEditModal";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Router'ı tanımlıyoruz
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (userResponse.status === 401) {
          router.push("/auth"); // Kullanıcı oturum açmamışsa auth sayfasına yönlendir
          return;
        }

        if (!userResponse.ok) {
          throw new Error("Profil bilgileri alınamadı");
        }

        const userData = await userResponse.json();
        setUser(userData);

        const postsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/user/${userData.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!postsResponse.ok) {
          throw new Error("Gönderiler alınamadı");
        }

        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router]);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  const handleSaveProfile = async (formData, type) => {
    try {
      // Profil güncelleme isteği gönderme eklenecek

      setShowEditModal(false);
      alert(type === "profile" ? "Profil güncellendi!" : "Şifre değiştirildi!");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme sırasında bir hata oluştu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-2xl">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-2xl text-red-500">Hata: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-2xl">Kullanıcı bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-3xl md:max-w-4/5 mx-auto">
        {/* Profil Başlığı */}
        <div className="flex flex-col items-center py-8 border-b border-gray-800">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4">
            <img
              src={user.profileImage}
              alt={user.studentId}
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold mt-2">{user.studentId}</h1>
          <p className="text-gray-500">@{user.username}</p>

          <p className="my-4 text-center px-6">{user.bio}</p>

          <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm mb-4">
            {user.department && (
              <div className="flex items-center">
                <FiMapPin className="mr-1" />
                <span>{user.department}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center">
                <FiLink className="mr-1" />
                <a
                  href={`https://${user.website}`}
                  className="text-blue-400 hover:underline"
                >
                  {user.website}
                </a>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center">
                <FiCalendar className="mr-1" />
                <span>
                  Katılım:{" "}
                  {new Intl.DateTimeFormat("tr-TR", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-bold hover:underline cursor-pointer">
                {user.following?.length || 0}
              </span>
              <span className="text-gray-500 ml-1">Takip</span>
            </div>
            <div>
              <span className="font-bold hover:underline cursor-pointer">
                {user.followers?.length || 0}
              </span>
              <span className="text-gray-500 ml-1">Takipçi</span>
            </div>
          </div>

          <button
            className="bg-white text-black rounded-full px-6 py-2 font-bold hover:bg-gray-200 transition"
            onClick={() => setShowEditModal(true)}
          >
            Profili Düzenle
          </button>
        </div>

        {/* Sekmeler */}
        <div className="flex border-b border-gray-800">
          <button className="flex-1 py-4 text-center font-bold border-b-2 border-blue-500 cursor-pointer">
            Gönderiler
          </button>
          <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-900 cursor-pointer">
            Medya
          </button>
        </div>

        {/* Gönderiler */}
        <div className="mt-1 px-1 md:px-0">
          {posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  post={post}
                  currentUserId={user.id}
                  updatePost={updatePost}
                />
              ))}
              <div className="flex justify-center my-2">
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              </div>
            </>
          ) : (
            <p className="p-4 text-center text-gray-500">Henüz gönderi yok.</p>
          )}
        </div>
      </main>

      {showEditModal && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
