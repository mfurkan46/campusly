"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Bookmark, MessageCircle, Star, Share2, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Post = ({ post, currentUserId, level = 0, updatePost, isDetailPage = false }) => {
  const router = useRouter();
  const defaultProfileImage = "/default_avatar.png";
  const [isHovering, setIsHovering] = useState(false);
  const hasIncrementedView = useRef(false);

  
  const incrementView = async () => {
    if (hasIncrementedView.current) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}/view`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Görüntülenme artırma başarısız");
      const updatedPost = await response.json();
      updatePost(updatedPost);
      hasIncrementedView.current = true;
    } catch (error) {
      
    }
  };

  const handlePostClick = async (e) => {
    if (!isDetailPage || level > 0) {
      
      if (!isDetailPage && level === 0) {
        await incrementView(); 
      }
      router.push(`/${post.user.username}/post/${post.id}`);
    }
  };

  const handleStar = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}/star`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Yıldızlama işlemi başarısız");

      const updatedPost = await response.json();
      updatePost(updatedPost);
    } catch (error) {
      
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post.id}/bookmark`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Yer işareti işlemi başarısız");

      const updatedPost = await response.json();
      updatePost(updatedPost);

      if (!post.bookmarks.includes(currentUserId)) {
        toast.success("Yer işaretlerine eklendi!", {
          autoClose: 2000,
        });
      } else {
        toast.info("Yer işaretlerinden kaldırıldı", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      const postUrl = `${window.location.origin}/${post.user.username}/post/${post.id}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success("Bağlantı panoya kopyalandı!", {
        autoClose: 2000,
      });
    } catch (error) {
      
    }
  };

  const highlightHashtags = (text) => {
    return text.split(/(\s+)/).map((word, index) =>
      word.startsWith("#") ? (
        <motion.span
          key={index}
          initial={{ color: "#FACC15" }}
          whileHover={{ scale: 1.05 }}
          className="text-yellow-300 hover:text-yellow-400 transition-colors cursor-pointer"
        >
          {word}
        </motion.span>
      ) : (
        word
      )
    );
  };

  const formatRelativeTime = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}d`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}sa`;
    }

    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
    }).format(postDate);
  };

  const isStarred =
    Array.isArray(post?.stars) && currentUserId
      ? post.stars.includes(currentUserId)
      : false;
  const isBookmarked =
    Array.isArray(post?.bookmarks) && currentUserId
      ? post.bookmarks.includes(currentUserId)
      : false;

  return (
    <div
      className={`w-full ${
        !isDetailPage || level > 0 ? "cursor-pointer" : "cursor-default"
      } mx-auto border-b-2 border-gray-800 transition-all duration-200 
      ${isHovering ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"} 
      ${level > 0 ? "ml-4 sm:ml-8 border-l-2 border-gray-700" : ""}`}
      onClick={handlePostClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="dark:border-gray-800 p-3 sm:p-4 transition-colors">
        <div className="flex">
          <motion.div
            className="mr-2 sm:mr-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              width={48}
              height={48}
              src={
                post.user.profileImage
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.user.profileImage}`
                  : defaultProfileImage
              }
              alt={post.user.studentId}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                <Link
                  href={`/${post.user.username}`}
                  className="font-bold text-black dark:text-white text-sm sm:text-base truncate hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.user.studentId}
                </Link>
                <span className="text-gray-500 text-xs sm:text-sm truncate">
                  @{post.user.username}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
            </div>
            <div className="text-black dark:text-white mb-2 sm:mb-3 text-sm sm:text-base break-words">
              {highlightHashtags(post.content)}
            </div>
            {post.image && (
              <motion.div
                className="mb-2 sm:mb-3 rounded-xl overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  width={500}
                  height={300}
                  src={post.image}
                  alt="Post image"
                  className="max-w-full h-auto object-contain border border-gray-700 rounded-xl"
                />
              </motion.div>
            )}
            <div className="flex justify-between text-gray-500 mt-1 sm:mt-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/${post.user.username}/post/${post.id}`}
                  className="flex items-center hover:text-blue-500 group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-1 sm:p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                    <MessageCircle size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-xs ml-1">{post.comments.length}</span>
                </Link>
              </motion.div>
              <motion.button
                className={`flex items-center cursor-pointer group ${
                  isStarred ? "text-yellow-500" : "hover:text-yellow-500"
                }`}
                onClick={handleStar}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/30">
                  <Star
                    size={16}
                    className="sm:w-5 sm:h-5"
                    fill={isStarred ? "currentColor" : "none"}
                    stroke={isStarred ? "none" : "currentColor"}
                  />
                </div>
                <span
                  className={`text-xs ml-1 ${isStarred ? "text-yellow-500" : ""}`}
                >
                  {post.stars.length}
                </span>
              </motion.button>
              <motion.button
                className="flex items-center group hover:text-blue-500 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                  <Activity size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs ml-1">{post.views}</span>
              </motion.button>
              <motion.button
                className={`flex items-center cursor-pointer group ${
                  isBookmarked ? "text-blue-500" : "hover:text-blue-500"
                }`}
                onClick={handleBookmark}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                  <Bookmark
                    size={16}
                    className="sm:w-5 sm:h-5"
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </div>
              </motion.button>
              <motion.button
                className="flex items-center hover:text-green-500 group cursor-pointer"
                onClick={handleShare}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-green-100 dark:group-hover:bg-green-900/30">
                  <Share2 size={16} className="sm:w-5 sm:h-5" />
                </div>
              </motion.button>
            </div>
            {isDetailPage && level > 0 && post.comments && post.comments.length > 0 && (
              <div className="mt-4">
                {post.comments.map((comment) => (
                  <Post
                    key={comment.id}
                    post={comment}
                    currentUserId={currentUserId}
                    level={level + 1}
                    updatePost={updatePost}
                    isDetailPage={isDetailPage}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;