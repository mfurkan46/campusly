"use client";
import { useState, useEffect } from "react";
import { Search, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function Explore() {
  const [activeTab, setActiveTab] = useState("gündemdekiler");
  const [trendingTopics, setTrendingTopics] = useState([]);

  // Backend’den trendleri çek
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/explore/trending");
        if (!response.ok) throw new Error("Trendler alınamadı");
        const data = await response.json();
        setTrendingTopics(data);
      } catch (error) {
        console.error("Trendleri alma hatası:", error.message);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="bg-opacity-95 backdrop-blur-sm z-10 border-b border-gray-800">
          <div className="flex justify-between items-center px-4 py-3">
            <h1 className="text-xl font-bold select-none">Keşfet</h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Search size={20} />
              </button>
            </div>
          </div>

          {/* Kategori Sekmeler */}
          <div className="flex border-b border-gray-800">
            <span className="flex-1 py-3 text-center text-xl font-medium text-white select-none">
              Gündemdekiler
            </span>
          </div>
        </div>

        {/* Trend Listesi */}
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
                    <button className="p-1 rounded-full hover:bg-gray-800 h-8 w-8 flex items-center justify-center self-start">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500">Trendler yükleniyor...</div>
          )}
        </div>
      </div>
    </div>
  );
}