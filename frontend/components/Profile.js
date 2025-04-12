"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiCalendar,
  FiMapPin,
  FiLink,
} from "react-icons/fi";
import Post from "../components/Post";
import Link from "next/link";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const meResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (meResponse.status === 401) {
          router.push("/auth");
          return;
        }

        if (!meResponse.ok) {
          throw new Error("Oturum açmış kullanıcı bilgisi alınamadı");
        }

        const meData = await meResponse.json();
        setCurrentUserId(meData.id);

        if (meData.username === username) {
          router.push("/profile");
          return;
        }

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${username}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!userResponse.ok) {
          throw new Error("Kullanıcı bulunamadı");
        }

        const userData = await userResponse.json();
        setUser(userData);

        // Kullanıcının postlarını al
        const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/user/${userData.id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

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

    if (username) {
      fetchData();
    }
  }, [username, router]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/follow`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Takip işlemi başarısız");
      }

      const updatedUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${username}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json());
      setUser(updatedUser);
    } catch (err) {
      console.error("Takip hatası:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/unfollow`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id }),
      });

      if (!response.ok) {
        throw new Error("Takip bırakma işlemi başarısız");
      }

      const updatedUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${username}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json());
      setUser(updatedUser);
    } catch (err) {
      console.error("Takip bırakma hatası:", err);
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
        <div className="text-2xl text-red-500">{error}</div>
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

  const isFollowing = user.followers && user.followers.includes(currentUserId);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <main className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center py-8 border-b border-gray-800">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4">
            <img
              src={user.profileImage || "https://img.freepik.com/premium-photo/merry-christmas-with-cartoon-santa-claus-snowman-gifts-box-ai-generated_848094-2167.jpg?w=740"}
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
                <Link
                  href={`https://${user.website}`}
                  className="text-blue-400 hover:underline"
                >
                  {user.website}
                </Link>
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

          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className="bg-gray-500 text-white rounded-full px-6 py-2 font-bold hover:bg-gray-600 transition"
            >
              Takibi Bırak
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className="bg-blue-500 text-white rounded-full px-6 py-2 font-bold hover:bg-blue-600 transition"
            >
              Takip Et
            </button>
          )}
        </div>

        <div className="flex border-b border-gray-800">
          <button className="flex-1 py-4 text-center font-bold border-b-2 border-blue-500 cursor-pointer">
            Gönderiler
          </button>
          <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-900 cursor-pointer">
            Medya
          </button>
        </div>

        <div>
        {posts.length > 0 ? (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          currentUserId={user.id}
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
    </div>
  );
}