"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/Post"; 

export default function Hashtag() {
  const { hashtag } = useParams(); // Dinamik hashtag parametresi
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // Kullanıcı ID'sini saklamak için state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/explore/hashtag/${hashtag}`,
          { credentials: "include" } // Kimlik doğrulama için
        );
        if (!response.ok) throw new Error("Postlar alınamadı");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Postları alma hatası:", error.message);
      }
    };

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
          setCurrentUserId(data.id); // Kullanıcı ID'sini state'e kaydediyoruz
        } catch (error) {
          console.error("Kullanıcı alınamadı:", error);
          setCurrentUserId(null); 
        }
      };

    if (hashtag) {
      fetchPosts();
      fetchUser();
    }
  }, [hashtag]);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto">
        {/* Hashtag Başlığı */}
        <div className="bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-800 px-4 py-3">
          <h1 className="text-xl font-bold">#{hashtag}</h1>
          <p className="text-sm text-gray-500">
           {posts.length} gönderi
          </p>
        </div>

        {/* Post Listesi */}
        <div className=" scroll-auto " id="stream">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                level={0}
                updatePost={updatePost}
              />
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500">
              Postlar yükleniyor veya bu hashtag’e ait post yok...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}