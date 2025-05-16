"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, AlertCircle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Post from "../components/Post";
import FollowListModal from "../components/FollowListModal";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { username } = useParams();
  const [showFollowModal, setShowFollowModal] = useState(null);

  const defaultProfileImage = "/default_avatar.png";

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

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${username}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!userResponse.ok) {
          throw new Error("Kullanıcı bulunamadı");
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

      const updatedUser = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${username}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());
      setUser(updatedUser);
    } catch (err) {
      
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

      const updatedUser = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/username/${username}`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());
      setUser(updatedUser);
    } catch (err) {
      
    }
  };

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
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
        throw new Error(`${type === "followers" ? "Takipçiler" : "Takip edilenler"} alınamadı`);
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

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className="text-lg">Yükleniyor...</p>
        </motion.div>
      </div>
    );
  }

  if (error === "Kullanıcı bulunamadı" || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-3xl mx-auto p-4">
          <header className="flex items-center mb-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleGoBack}
              className="p-2 mr-4 rounded-full hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h1 className="text-xl font-bold">Profil</h1>
          </header>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <AlertCircle size={48} className="text-gray-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Böyle bir hesap bulunamadı</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              @{username} adlı kullanıcıya ait hesap mevcut değil. Lütfen kullanıcı adını kontrol edin veya başka bir kullanıcı arayın.
            </p>
            
            
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4"
      >
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-900/30 mb-4">
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors font-medium"
        >
          Yeniden deneyin
        </motion.button>
      </motion.div>
    );
  }

  const isFollowing = user.followers && user.followers.includes(currentUserId);

  return (
    <motion.div
      className="min-h-screen bg-[#0a0a0a] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="max-w-3xl mx-auto">
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

          <motion.p
            className="my-4 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {user.bio}
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 text-gray-500 text-sm mb-4">
            {(user.faculty || user.department) && (
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <MapPin size={16} className="mr-1" />
                <span>
                  {user.faculty && user.department
                    ? `${user.faculty}, ${user.department}`
                    : user.faculty || user.department}
                </span>
              </motion.div>
            )}
            {user.createdAt && (
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Calendar size={16} className="mr-1" />
                <span>
                  Katılım:{" "}
                  {new Intl.DateTimeFormat("tr-TR", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(user.createdAt))}
                </span>
              </motion.div>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => handleOpenFollowModal("following")}
                className="font-bold hover:underline cursor-pointer flex items-center"
              >
                <span className="mr-1">{user.following?.length || 0}</span>
                <span className="text-gray-500">Takip</span>
              </button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={`${
              isFollowing ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white rounded-full px-6 py-2 font-bold transition flex items-center`}
            transition={{ duration: 0.2 }}
          >
            {isFollowing ? "Takibi Bırak" : "Takip Et"}
          </motion.button>
        </motion.div>

        <motion.div
          className="flex border-b border-gray-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button className="flex-1 py-4 text-center font-bold border-b-2 border-blue-500 cursor-pointer flex justify-center items-center">
            Gönderiler
          </button>
        </motion.div>

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
                    currentUserId={currentUserId}
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

      <AnimatePresence>
        {showFollowModal && (
          <FollowListModal
            isOpen={!!showFollowModal}
            onClose={() => setShowFollowModal(null)}
            users={showFollowModal.users}
            title={showFollowModal.type === "followers" ? "Takipçiler" : "Takip Edilenler"}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}