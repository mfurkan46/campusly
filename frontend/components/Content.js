"use client";
import React, { useState, useEffect } from "react";
import Textbox from "@/components/TextBox";
import Post from "./Post";

const Content = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Postlar alınamadı");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Postları alma hatası:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    <main className="min-h-screen mx-auto w-full h-full">
      <Textbox currentUserId={currentUserId} addPost={addPost} />
      <div className="mt-4" id="stream">
      {posts.length > 0 ? (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          level={0}
          currentUserId={currentUserId}
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
  );
};

export default Content;