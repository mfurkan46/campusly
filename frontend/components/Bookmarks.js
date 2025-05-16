"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Post from "../components/Post";
import { toast } from "react-toastify";
import { Bookmark } from "lucide-react";

export default function Bookmarks() {
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (userResponse.status === 401) {
          router.push("/auth");
          return;
        }

        if (!userResponse.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }

        const userData = await userResponse.json();
        setUserId(userData.id);


        const postsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${userData.id}/bookmarked-posts`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!postsResponse.ok) {
          throw new Error("Kaydedilen gönderiler alınamadı");
        }

        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (err) {
        setError(err.message);
        toast.error(`Hata: ${err.message}`, { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedPosts();
  }, [router]);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] dark:text-white flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] dark:text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 flex items-center justify-center rounded-full dark:bg-red-900/30 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-xl font-bold mb-2">Bir şeyler yanlış gitti.</div>
        <p className="text-gray-500 text-center max-w-md mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors font-medium"
        >
          Yeniden deneyin
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] dark:text-white">
      <main className="max-w-3xl md:max-w-4/5 mx-auto">
        <h1 className="text-2xl font-bold py-4 border-b border-gray-800 text-center">
          Kaydedilen Gönderiler
        </h1>
        <div className="mt-1 px-1 md:px-0">
          {posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <div key={post.id}>
                  <Post
                    post={post}
                    currentUserId={userId}
                    updatePost={updatePost}
                  />
                </div>
              ))}
              <div className="flex justify-center my-2">
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center">
              <Bookmark size={48} className="mb-4 text-gray-600" />
              <p className="text-lg">Henüz kaydedilen gönderi yok.</p>
              <p className="mt-2 text-sm">
                Kaydettiğiniz gönderiler burada görünecek.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}