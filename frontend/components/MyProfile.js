"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, User, Edit, Users } from "lucide-react";
import { motion } from "framer-motion";
import Post from "../components/Post";
import ProfileEditModal from "./ProfileEditModal";
import FollowListModal from "../components/FollowListModal";
import { toast } from 'react-toastify';

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(null);

  const defaultProfileImage = "/default_avatar.png";

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
          router.push("/auth");
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

  const handleSaveProfile = async (updatedUser, type) => {
    try {
      if (type === "profile") {
        setUser(updatedUser);
        const postsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/user/${updatedUser.id}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      }
    } catch (err) {
     
    }
  };

  const fetchFollowList = async (type) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${type}/${user.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `${type === "followers" ? "Takipçiler" : "Takip edilenler"} alınamadı`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return [];
    }
  };

  const handleOpenFollowModal = async (type) => {
    const users = await fetchFollowList(type);
    setShowFollowModal({ type, users });
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] dark:text-white flex items-center justify-center">
        <motion.div 
          className="text-center p-6 bg-gray-900 rounded-lg max-w-md"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 flex justify-center">
            <User size={64} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profil Bulunamadı</h2>
          <p className="text-gray-400 mb-4">Aradığınız kullanıcı profili mevcut değil veya erişim izniniz yok.</p>
          <button 
            onClick={() => router.push("/")}
            className="bg-white text-black py-2 px-6 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Ana Sayfaya Dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#0a0a0a] dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="max-w-3xl md:max-w-4/5 mx-auto">
        <motion.div 
          className="flex flex-col items-center py-8 border-b border-gray-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-32 h-32 rounded-full overflow-hidden border-4 border-black mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={
                user.profileImage
                  ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
                  : defaultProfileImage
              }
              alt={user.studentId}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <h1 className="text-2xl font-bold mt-2">{user.studentId}</h1>
          <p className="text-gray-500">@{user.username}</p>

          <p className="my-4 text-center px-6">{user.bio}</p>

          <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm mb-4">
            {(user.faculty || user.department) && (
              <div className="flex items-center">
                <MapPin size={16} className="mr-1" />
                <span>
                  {user.faculty && user.department
                    ? `${user.faculty}, ${user.department}`
                    : user.faculty || user.department}
                </span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
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
            <motion.div whileHover={{ scale: 1.05 }}>
              <button
                onClick={() => handleOpenFollowModal("following")}
                className="font-bold hover:underline cursor-pointer flex items-center"
              >
                <span className="mr-1">{user.following?.length || 0}</span>
                <span className="text-gray-500">Takip</span>
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <button
                onClick={() => handleOpenFollowModal("followers")}
                className="font-bold hover:underline cursor-pointer flex items-center"
              >
                <span className="mr-1">{user.followers?.length || 0}</span>
                <span className="text-gray-500">Takipçi</span>
              </button>
            </motion.div>
          </div>

          <motion.button
            className="bg-white text-black rounded-full px-6 py-2 font-bold hover:bg-gray-200 transition flex items-center"
            onClick={() => setShowEditModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit size={16} className="mr-2" />
            Profili Düzenle
          </motion.button>
        </motion.div>

        <div className="flex border-b border-gray-800">
          <button className="flex-1 py-4 text-center font-bold border-b-2 border-blue-500 cursor-pointer flex justify-center items-center">
            <Users size={18} className="mr-2" />
            Gönderiler
          </button>
        </div>

        <motion.div 
          className="mt-1 px-1 md:px-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {posts.length > 0 ? (
            <>
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Post
                    post={post}
                    currentUserId={user.id}
                    updatePost={updatePost}
                  />
                </motion.div>
              ))}
              <div className="flex justify-center my-2">
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              </div>
            </>
          ) : (
            <motion.div 
              className="p-8 text-center text-gray-500 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Users size={48} className="mb-4 text-gray-600" />
              <p className="text-lg">Henüz gönderi yok.</p>
              
            </motion.div>
          )}
        </motion.div>
      </main>

      {showEditModal && (
        <ProfileEditModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {showFollowModal && (
        <FollowListModal
          isOpen={!!showFollowModal}
          onClose={() => setShowFollowModal(null)}
          users={showFollowModal.users}
          title={showFollowModal.type === "followers" ? "Takipçiler" : "Takip Edilenler"}
        />
      )}
    </motion.div>
  );
}