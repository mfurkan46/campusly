"use client";
import React from "react";
import Image from "next/image";
import {
  CiBookmark,
  CiChat1,
  CiCircleMore,
  CiStar,
  CiWavePulse1,
  CiShare1,
} from "react-icons/ci";


const Post = ({ post, currentUserId, level = 0, updatePost }) => {
  const handleStar = async () => {
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
      updatePost(updatedPost); // Backend'den gelen tam post objesini gönderiyoruz
    } catch (error) {
      console.error("Yıldızlama hatası:", error);
    }
  };

  const handleBookmark = async () => {
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
      updatePost(updatedPost); // Backend'den gelen tam post objesini gönderiyoruz
    } catch (error) {
      console.error("Yer işareti hatası:", error);
    }
  };

  const handleCommentClick = () => {
    alert("Yorum yapma özelliği yakında eklenecek!");
  };

  const isStarred =
    Array.isArray(post?.stars) && currentUserId
      ? post.stars.includes(currentUserId)
      : false;
  const isBookmarked =
    Array.isArray(post?.bookmarks) && currentUserId
      ? post.bookmarks.includes(currentUserId)
      : false;

  const highlightHashtags = (text) => {
    return text.split(/(\s+)/).map((word, index) =>
      word.startsWith("#") ? (
        <span key={index} className="text-yellow-300">
          {word}
        </span>
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
      return `${diffInSeconds}s`; // saniye bazlı gösterim
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}d`; // dakika bazlı gösterim
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}sa`; // saat bazlı gösterim
    }

    // 24 saatten büyükse sadece tarih göster
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
    }).format(postDate);
  };
  return (
    <div
      className={`w-full cursor-pointer mx-auto border-b-2 border-gray-800 bg-gray-50 dark:bg-gray-900 ${
        level > 0 ? "ml-4 sm:ml-8 border-l-2 border-gray-700" : ""
      }`}
    >
      <div className="border-gray-200 dark:border-gray-800 p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <div className="flex">
          <div className="mr-2 sm:mr-3 flex-shrink-0">
            <img
              src={post.user.profileImage || "/default-avatar.png"}
              alt={post.user.studentId}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300"
            />
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                <a
                  href={`/${post.user.username}`}
                  className="font-bold text-black dark:text-white text-sm sm:text-base truncate hover:underline"
                >
                  {post.user.studentId}
                </a>
                <span className="text-gray-500 text-xs sm:text-sm truncate">
                  @{post.user.username}
                </span>
                <span className="text-gray-500  ">·</span>
                <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                  {formatRelativeTime(post.createdAt)}
                </span>
              </div>
              <button className="text-gray-500 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer p-1 sm:p-2 rounded-full flex-shrink-0">
                <CiCircleMore size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="text-black dark:text-white mb-2 sm:mb-3 text-sm sm:text-base break-words">
              {highlightHashtags(post.content)}
            </div>
            {post.image && (
              <div className="mb-2 sm:mb-3 rounded-xl overflow-hidden">
                <Image
                  width={350}
                  height={200}
                  src={post.image}
                  alt="Post image"
                  className="max-w-full h-auto object-contain border border-gray-700 rounded-xl"
                />
              </div>
            )}
            <div className="flex justify-between text-gray-500 mt-1 sm:mt-2">
              <button
                className="flex items-center hover:text-blue-500 group"
                onClick={handleCommentClick}
              >
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-blue-100 cursor-pointer dark:group-hover:bg-blue-900/30">
                  <CiChat1 size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs ml-1">{post.comments.length}</span>
              </button>
              <button
                className={`flex items-center cursor-pointer group ${
                  isStarred ? "text-yellow-500" : "hover:text-yellow-500"
                }`}
                onClick={handleStar}
              >
                <div className="p-1 sm:p-2 rounded-full dark:group-hover:bg-yellow-900/30">
                  <CiStar
                    size={16}
                    className="sm:w-5 sm:h-5"
                    fill={isStarred ? "currentColor" : "gray"}
                  />
                </div>
                <span
                  className={`text-xs ml-1 ${
                    isStarred ? "text-yellow-500" : ""
                  }`}
                >
                  {post.stars.length}
                </span>
              </button>
              <button className="flex items-center group hover:text-blue-500 cursor-pointer">
                <div className="p-1 sm:p-2 rounded-full dark:group-hover:bg-blue-900/30">
                  <CiWavePulse1 size={16} className="sm:w-5 sm:h-5" />
                </div>
                <span className="text-xs ml-1">{post.views}</span>
              </button>
              <button
                className={`flex items-center cursor-pointer group ${
                  isBookmarked ? "text-blue-500" : "hover:text-blue-500"
                }`}
                onClick={handleBookmark}
              >
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                  <CiBookmark
                    size={16}
                    className="sm:w-5 sm:h-5"
                    fill={isBookmarked ? "currentColor" : "gray"}
                  />
                </div>
              </button>
              <button className="flex items-center hover:text-blue-500 group cursor-pointer">
                <div className="p-1 sm:p-2 rounded-full group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                  <CiShare1 size={16} className="sm:w-5 sm:h-5" />
                </div>
              </button>
            </div>
            {post.comments && post.comments.length > 0 && (
              <div className="mt-4">
                {post.comments.map((comment) => (
                  <Post
                    key={comment.id}
                    post={comment}
                    currentUserId={currentUserId}
                    level={level + 1}
                    updatePost={updatePost}
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
