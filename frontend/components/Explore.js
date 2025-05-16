"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";
import { toast } from "react-toastify";

export default function Explore() {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/explore/trending`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Trendler alınamadı");
        const data = await response.json();
        setTrendingTopics(data);
      } catch (error) {
        toast.error(`Hata: ${error.message}`, { position: "top-right", autoClose: 3000 });
      }
    };
    fetchTrending();
  }, []);


  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?query=${encodeURIComponent(query)}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 404) throw new Error("Kullanıcı bulunamadı");
        if (!response.ok) throw new Error("Arama başarısız");
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        setError(error.message);
        toast.error(`Hata: ${error.message}`, { position: "top-right", autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);


  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setError(null);
    }
  };


  const memoizedSearchResults = useMemo(() => searchResults, [searchResults]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-800 sticky top-0">
          <div className="flex justify-between items-center px-4 py-3">
            <h1 className="text-xl font-bold select-none">Keşfet</h1>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-full hover:bg-gray-800 cursor-pointer"
                onClick={toggleSearch}
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
          </div>

          {/* Arama Input Alanı */}
          {isSearchOpen && (
            <div className="px-4 py-3 border-b border-gray-800">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kullanıcı ara..."
                className="w-full bg-gray-900 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Arama Sonuçları */}
        {isSearchOpen && (
          <div className="absolute z-20 w-full max-w-5xl bg-[#0a0a0a] border-b border-gray-800">
            {loading ? (
              <div className="p-4 text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg">Aranıyor...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-gray-500">
                <p>{error}</p>
              </div>
            ) : memoizedSearchResults.length > 0 ? (
              memoizedSearchResults.map((user) => (
                <Link href={`/${user.username}`} key={user.id}>
                  <div className="px-4 py-3 hover:bg-gray-900/50 cursor-pointer">
                    <div className="flex items-center">
                      <img
                        src={
                          user.profileImage
                            ? `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`
                            : "/default_avatar.png"
                        }
                        alt={user.studentId}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-bold">{user.studentId}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : searchQuery.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                <p>Kullanıcı bulunamadı</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Trend Listesi */}
        {!isSearchOpen && (
          <div className="divide-y divide-gray-800">
            {trendingTopics.length > 0 ? (
              trendingTopics.map((trend, index) => (
                <Link href={`/explore/${trend.name.slice(1)}`} key={trend.name}>
                  <div className="px-4 py-3 hover:bg-gray-900/50 cursor-pointer">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{index + 1} · Gündemdekiler</span>
                        </div>
                        <div className="font-bold mt-0.5">{trend.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {trend.postCount} gönderi
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="min-h-screen dark:text-white flex flex-col items-center justify-center p-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-lg">Yükleniyor...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}