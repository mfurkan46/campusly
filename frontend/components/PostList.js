"use client";
import React, { useState, useEffect } from "react";
import Post from "./Post"; // Var olan Post bileşeninizi import ediyoruz

const PostList = ({ initialPosts = [], currentUserId, hashtag = null, username = null }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    hashtag: hashtag,
    username: username,
  });

  // Post güncelleme fonksiyonu (yıldızlama, yer işareti, vb. için)
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  // İlgili URL'den postları çek
  const fetchPosts = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/posts";
      
      // Filtreleme parametreleri ekle
      const params = new URLSearchParams();
      if (filter.hashtag) params.append("hashtag", filter.hashtag);
      if (filter.username) params.append("username", filter.username);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Gönderiler yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
      console.error("Post yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtre değiştiğinde postları yeniden yükle
  useEffect(() => {
    // Dışarıdan gelen props değiştiğinde state'i güncelle
    setFilter({
      hashtag: hashtag,
      username: username,
    });
    
    // initialPosts dolu değilse veya filtre değişmişse
    if (initialPosts.length === 0 || hashtag || username) {
      fetchPosts();
    }
  }, [hashtag, username]);

  // Bir hashtag'e tıklanırsa
  const handleHashtagClick = (tag) => {
    // Burada hashtag filtrelemesi için navigasyon yapılabilir
    // Örneğin: router.push(`/hashtag/${tag.replace('#', '')}`);
    // Şimdilik sadece state üzerinde filtreleme yapalım
    setFilter({ ...filter, hashtag: tag });
    // Gerçekte burada sayfayı yönlendirirsiniz veya filtreyi güncellersiniz
  };

  // Filtreyi temizleme
  const clearFilter = () => {
    setFilter({ hashtag: null, username: null });
    fetchPosts();
  };

  // İçerikte hashtag'leri işaretleyip tıklanabilir yapma
  const renderContentWithClickableHashtags = (content) => {
    // Basit bir regex ile hashtag'leri bul
    const hashtagRegex = /#[\w]+/g;
    const parts = content.split(hashtagRegex);
    const hashtags = content.match(hashtagRegex) || [];
    
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {hashtags[index] && (
              <span 
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => handleHashtagClick(hashtags[index])}
              >
                {hashtags[index]}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Filtre bilgisi ve temizleme */}
      {(filter.hashtag || filter.username) && (
        <div className="bg-gray-100 dark:bg-gray-800 p-3 sticky top-0 z-10 border-b border-gray-300 dark:border-gray-700 mb-2">
          <div className="flex justify-between items-center">
            <div>
              {filter.hashtag && (
                <span className="font-bold mr-2">
                  {filter.hashtag} ile ilgili gönderiler
                </span>
              )}
              {filter.username && (
                <span className="font-bold">
                  @{filter.username} kullanıcısının gönderileri
                </span>
              )}
            </div>
            <button 
              onClick={clearFilter}
              className="text-blue-500 text-sm hover:underline"
            >
              Filtreyi Temizle
            </button>
          </div>
        </div>
      )}

      {/* Yükleniyor durumu */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Gönderiler yükleniyor...</p>
        </div>
      )}

      {/* Hata durumu */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-md my-4">
          <p>{error}</p>
          <button 
            onClick={fetchPosts} 
            className="mt-2 text-sm underline"
          >
            Yeniden dene
          </button>
        </div>
      )}

      {/* Gönderiler */}
      <div className="space-y-1">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post 
              key={post.id} 
              post={{
                ...post,
                // İçeriği özelleştirilmiş şekilde göndermek istiyorsanız
                // renderContent: renderContentWithClickableHashtags(post.content)
              }} 
              currentUserId={currentUserId}
              updatePost={updatePost}
            />
          ))
        ) : !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Gösterilecek gönderi bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;