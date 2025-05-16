"use client";
import React, { useState, useEffect } from "react";
import Post from "./Post";
import { ArrowUp, Image, CircleArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostDetail = () => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const maxCharacters = 280;
  const defaultProfileImage = "/default_avatar.png";

  const fetchCurrentUser = async () => {
    try {
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (userResponse.status === 401) {
        router.push("/auth");
        return null;
      }

      if (!userResponse.ok) {
        throw new Error("Kullanıcı bilgileri alınamadı");
      }

      const userData = await userResponse.json();
      return userData;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const fetchPostData = async () => {
    try {
      const postResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!postResponse.ok) {
        throw new Error("Post bulunamadı");
      }

      const postData = await postResponse.json();
      setPost(postData);
      const postComments = postData.comments || [];
      setComments(postComments);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const userData = await fetchCurrentUser();
      if (userData) {
        setCurrentUser(userData);
        await fetchPostData();
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, [postId]);

  const updatePost = (updatedPost) => {
    setPost(updatedPost);
  };

  const updateComment = (updatedComment) => {
    setComments(comments.map((c) => (c.id === updatedComment.id ? updatedComment : c)));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Dosya boyutu 5MB'tan büyük olamaz!", {
          position: "bottom-right",
          autoClose: 2000,
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractHashtags = (content) => {
    const hashtagRegex = /#\w+/g;
    const matches = content.match(hashtagRegex) || [];
    return matches.map((tag) => tag.slice(1));
  };

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

  const calculateRemainingChars = () => {
    return maxCharacters - comment.length;
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !currentUser) return;

    const hashtags = extractHashtags(comment);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
          image: commentImage || null,
          targetPostId: parseInt(postId),
          hashtags,
        }),
      });

      if (!response.ok) {
        throw new Error("Yorum gönderilemedi");
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      setComment("");
      setCommentImage(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Hata: ${err.message}`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
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

  if (!post) {
    return (
      <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <h2 className="text-xl font-bold mb-2">Post bulunamadı</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] max-w-3xl md:max-w-4/5 mx-auto px-2">
      <header className="z-10 bg-[#0a0a0a] backdrop-blur-md border-b dark:border-gray-800 mb-2">
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="mr-6 text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            <CircleArrowLeft className="h-5 w-5 dark:text-white" />
          </button>
          <h1 className="text-xl font-bold dark:text-white">Paylaşım</h1>
        </div>
      </header>
      <main className="max-w-3xl md:max-w-4/5 mx-auto px-2">
        <div className="border-b dark:border-gray-800 pb-2">
          <Post
            post={post}
            currentUserId={currentUser?.id}
            updatePost={updatePost}
            isDetailPage={true}
          />
        </div>
        <div className="p-4 border-b dark:border-gray-800 mb-2">
          <div className="w-full bg-gray-900 rounded-xl shadow-md">
            <div className="p-3 sm:p-4">
              <form onSubmit={handleSubmitComment}>
                <div className="flex">
                  <div className="mr-2 sm:mr-3 flex-shrink-0">
                    <img
                      src={
                        currentUser?.profileImage
                          ? `${process.env.NEXT_PUBLIC_API_URL}${currentUser.profileImage}`
                          : defaultProfileImage
                      }
                      alt="Your avatar"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="relative">
                      <textarea
                        className="w-full p-2 bg-transparent border-none resize-none outline-none dark:text-white text-sm sm:text-base"
                        placeholder="Yanıtınızı yazın..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                      />
                      <div className="absolute top-0 left-0 w-full p-2 text-sm sm:text-base whitespace-pre-wrap pointer-events-none opacity-50">
                        {highlightHashtags(comment)}
                      </div>
                    </div>
                    {commentImage && (
                      <div className="mb-2">
                        <img
                          src={commentImage}
                          alt="Preview"
                          className="max-w-full h-auto rounded-md max-h-40"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <label className="text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-800 p-1 sm:p-2 rounded-full cursor-pointer">
                          <Image size={16} className="sm:w-5 sm:h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div
                          className={`text-xs sm:text-sm ${
                            calculateRemainingChars() < 20
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {calculateRemainingChars()}
                        </div>
                        <button
                          type="submit"
                          disabled={comment.length === 0 || comment.length > maxCharacters}
                          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium ${
                            comment.length === 0 || comment.length > maxCharacters
                              ? "bg-blue-300 text-white cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                          }`}
                        >
                          <ArrowUp size={16} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="p-4 border-b dark:border-gray-800">
          <h2 className="text-lg font-bold dark:text-white">
            Yorumlar ({comments.length})
          </h2>
        </div>
        <div className="divide-y dark:divide-gray-800">
          {comments.map((comment) => (
            <Post
              key={comment.id}
              post={comment}
              currentUserId={currentUser?.id}
              updatePost={updateComment}
              isDetailPage={true}
            />
          ))}
        </div>
        {comments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>Henüz yorum yapılmamış.</p>
            <p className="mt-2">İlk yorumu sen yap!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PostDetail;