"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Post from "@/components/Post";
import { Hash,  AlertCircle } from "lucide-react"; 

export default function Hashtag() {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/explore/hashtag/${hashtag}`,
          { credentials: "include" }
        );
        if (!response.ok) throw new Error("Gönderiler alınamadı");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
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
        setCurrentUserId(data.id);
      } catch (error) {
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


  if (loading) {
    return (
      <div className="min-h-screen   dark:text-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-800  top-0 px-4 py-3">
            <div className="flex items-center space-x-2">
              <Hash size={20} className="text-blue-400" />
              <h1 className="text-xl font-bold">#{hashtag}</h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Gönderiler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen  dark:text-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-800  px-4 py-3">
            <div className="flex items-center space-x-2">
              <Hash size={20} className="text-blue-400" />
              <h1 className="text-xl font-bold">#{hashtag}</h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertCircle size={24} className="text-red-500" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Bir şeyler yanlış gitti</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
            >
              Yeniden dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-black dark:text-white">
      <div className="max-w-5xl mx-auto">

        <div className=" bg-opacity-95 backdrop-blur-sm  top-0 z-10 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center space-x-2">
            <Hash size={20} className="text-blue-400" />
            <h1 className="text-xl font-bold">#{hashtag}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {posts.length} {posts.length === 1 ? 'gönderi' : 'gönderi'}
          </p>
        </div>

        {/* Post Listesi */}
        <div className="scroll-auto divide-y divide-gray-200 dark:divide-gray-800" id="stream">
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
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Hash size={24} className="text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Henüz gönderi yok</h2>
              <p className="text-gray-500 max-w-md">
                #{hashtag} etiketi ile henüz bir gönderi paylaşılmamış. İlk paylaşımı siz yapabilirsiniz!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}