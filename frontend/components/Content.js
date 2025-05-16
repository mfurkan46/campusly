"use client";
import React, { useState, useEffect } from "react";
import Textbox from "@/components/TextBox";
import Post from "./Post";
import { ArrowDown } from "lucide-react";

const Content = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const TAKE = 5; 

  const fetchPosts = async (pageNum) => {
    if (isLoading || !hasMore) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/algorithm?page=${pageNum}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Postlar alınamadı");
      }

      const { posts: newPosts, totalPosts } = await response.json();

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts, ...newPosts];
        setHasMore(newPosts.length > 0 && updatedPosts.length < totalPosts);

        return updatedPosts;
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchPosts(page);
    } else {
      
    }
  }, [page, currentUserId]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <main className="w-full">
      <Textbox currentUserId={currentUserId} addPost={addPost} />
      <div className="mt-4" id="stream">
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <div key={post.id}>
                <Post
                  post={post}
                  level={0}
                  currentUserId={currentUserId}
                  updatePost={updatePost}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center my-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {hasMore && !isLoading && (
              <div className="flex justify-center my-2 mb-8">
                <button
                  onClick={handleLoadMore}
                  className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <ArrowDown className="group-hover:animate-bounce" />
                  Daha Fazla Yükle
                </button>
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <div className="flex justify-center my-2 mb-8">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-gray-500 mb-8">Henüz gönderi yok.</div>
        )}
      </div>
    </main>
  );
};

export default Content;