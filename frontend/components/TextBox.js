"use client";
import React, { useState } from "react";
import { ArrowUp, Image, } from "lucide-react";

const Textbox = ({ currentUserId, addPost }) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const maxCharacters = 280;

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'tan büyük olamaz!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractHashtags = (content) => {
    const hashtagRegex = /#\w+/g;
    const matches = content.match(hashtagRegex) || [];
    return matches.map((tag) => tag.slice(1));
  };

  const calculateRemainingChars = () => {
    return maxCharacters - text.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      console.error("Kullanıcı ID'si bulunamadı");
      return;
    }
  
    const hashtags = extractHashtags(text);
  
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          image: image || null,
          hashtags,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Post yayınlama başarısız - Durum: ${response.status}, Mesaj: ${errorData.error || "Bilinmeyen hata"}`);
      }
      const newPost = await response.json();
      addPost(newPost);
      setText("");
      setImage(null);
    } catch (error) {
      console.error("Post yayınlama hatası:", error.message);
    }
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

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <div className="p-3 sm:p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex">
            {/* Profil resmi */}
            <div className="mr-2 sm:mr-3 flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Yazı yazma alanı */}
            <div className="flex-grow min-w-0">
              <div className="relative">
                <textarea
                  className="w-full p-2 bg-transparent border-none resize-none outline-none dark:text-white text-sm sm:text-base"
                  placeholder="Kampüste Neler Oluyor?"
                  value={text}
                  onChange={handleChange}
                  rows={3}
                />
                <div className="absolute top-0 left-0 w-full p-2 text-sm sm:text-base whitespace-pre-wrap pointer-events-none opacity-50">
                  {highlightHashtags(text)}
                </div>
              </div>

              {/* Resim önizleme */}
              {image && (
                <div className="mb-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md max-h-40"
                  />
                </div>
              )}

              {/* Karakter sayacı ve görsel öğeler */}
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
                  {/* <button
                    type="button"
                    className="text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-800 p-1 sm:p-2 rounded-full"
                  >
                    <Smile size={16} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-800 p-1 sm:p-2 rounded-full"
                  >
                    <Calendar size={16} className="sm:w-5 sm:h-5" />
                  </button>
                  <button
                    type="button"
                    className="text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-800 p-1 sm:p-2 rounded-full"
                  >
                    <MapPin size={16} className="sm:w-5 sm:h-5" />
                  </button> */}
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
                    disabled={text.length === 0 || text.length > maxCharacters}
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium 
                      ${
                        text.length === 0 || text.length > maxCharacters
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
  );
};

export default Textbox;
