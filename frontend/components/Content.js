"use client";
import React, { useState, useEffect } from "react";
import Textbox from "@/components/TextBox";
import Post from "./Post";

const Content = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
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
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Yeni postu listenin başına ekle
  };

  return (
    <div className="w-full h-full">
      <Textbox currentUserId={currentUserId} addPost={addPost} />
      <div className="scroll-auto mt-4" id="stream">
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
          <p>Henüz post yok.</p>
        )}
      </div>
    </div>
  );
};

export default Content;