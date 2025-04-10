"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Messages() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [userId, setUserId] = useState(null);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const router = useRouter();

  // Kendi ID'mizi al
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include", // Çerezleri dahil et
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error("Kullanıcı ID'si alınamadı");
        }
        const data = await res.json();
        if (!data.id) {
          throw new Error("API'den ID dönmedi");
        }
        setUserId(data.id);
        socket.emit("join", data.id);
      } catch (error) {
        console.error("Hata:", error.message);
        router.push("/auth"); // Hata varsa login sayfasına yönlendir
      }
    };
    fetchUserId();
  }, [router]);

  // Konuşmaları yükle
  useEffect(() => {
    if (!userId) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error("Konuşmalar alınamadı");
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Konuşmalar bir dizi değil");
        }
        setConversations(data);
      } catch (error) {
        console.error("Hata:", error.message);
      }
    };
    fetchConversations();
  }, [userId]);

  // Aktif konuşmayı yükle
  useEffect(() => {
    if (!userId || !activeConversation) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/conversation/${activeConversation}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          throw new Error("Mesajlar alınamadı");
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Mesajlar bir dizi değil");
        }
        setMessagesByConversation((prev) => ({
          ...prev,
          [activeConversation]: data,
        }));
      } catch (error) {
        console.error("Hata:", error.message);
      }
    };
    fetchMessages();
  }, [userId, activeConversation]);

  // Socket.IO ile yeni mesajları dinle
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      const convoId =
        newMessage.senderId === userId
          ? newMessage.receiverId
          : newMessage.senderId;
      setMessagesByConversation((prev) => ({
        ...prev,
        [convoId]: [...(prev[convoId] || []), newMessage],
      }));
      setConversations((prev) =>
        prev.map((convo) =>
          convo.otherUser.id === convoId
            ? { ...convo, lastMessage: newMessage.content, timestamp: newMessage.createdAt }
            : convo
        )
      );
    });
    return () => socket.off("newMessage");
  }, [userId]);

  // Kullanıcı arama
  useEffect(() => {
    if (!showNewMessageModal || !searchQuery) {
      setSearchedUsers([]);
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/search?query=${searchQuery}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          const errorData = await res.json(); // Sunucudan dönen hata mesajını al
          throw new Error(
            `Kullanıcılar alınamadı - Durum: ${res.status}, Mesaj: ${errorData.error || "Bilinmeyen hata"}`
          );
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Arama sonucu bir dizi değil");
        }
        setSearchedUsers(data.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Hata:", error.message);
        setSearchedUsers([]);
      }
    };
    fetchUsers();
  }, [searchQuery, showNewMessageModal, userId]);

  const sendMessage = async () => {
    if (!message.trim() || !activeConversation || !userId) return;

    const newMessage = {
      senderId: userId,
      receiverId: activeConversation,
      content: message,
    };

    socket.emit("sendMessage", newMessage);
    setMessage("");
  };

  const handleConversationSelect = (id) => {
    setActiveConversation(id);
    setShowNewMessageModal(false);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleNewConversation = () => {
    setShowNewMessageModal(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesByConversation, activeConversation]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <main className="flex h-screen overflow-hidden md:max-w-6xl mx-auto md:pr-3">
        {/* Sol Taraf - Mesaj Listesi */}
        <div
          className={`${
            showSidebar ? "flex" : "hidden"
          } md:flex flex-col h-full fixed md:static left-0 top-0 bottom-0 z-20 bg-[#0a0a0a] w-full md:w-1/3 lg:w-1/4 border-r border-gray-800`}
        >
          <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Mesajlar</h1>
              <button
                onClick={handleNewConversation}
                className="p-2 rounded-full hover:bg-gray-800 text-blue-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
              </button>
            </div>
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Mesajları ara"
                className="w-full bg-gray-800 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              />
              <div className="absolute right-3 top-2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((convo) => (
              <div
                key={convo.otherUser.id}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-900 transition-colors ${
                  activeConversation === convo.otherUser.id ? "bg-gray-900" : ""
                }`}
                onClick={() => handleConversationSelect(convo.otherUser.id)}
              >
                <div className="flex items-start">
                  <img
                    src={convo.otherUser.profileImage || "/api/placeholder/40/40"}
                    alt={convo.otherUser.username}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">{convo.otherUser.username}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(convo.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{convo.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Taraf - Mesaj İçeriği */}
        <div
          className={`${
            !showSidebar ? "flex" : "hidden"
          } md:flex flex-col h-full w-full`}
        >
          <div className="sticky top-0 z-10 bg-[#0a0a0a] backdrop-blur-sm border-b border-gray-800 p-4">
            <div className="flex items-center">
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              {activeConversation && (
                <>
                  <img
                    src={
                      conversations.find((c) => c.otherUser.id === activeConversation)
                        ?.otherUser.profileImage || "/api/placeholder/40/40"
                    }
                    alt={
                      conversations.find((c) => c.otherUser.id === activeConversation)
                        ?.otherUser.username
                    }
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h2 className="font-bold">
                      {conversations.find((c) => c.otherUser.id === activeConversation)
                        ?.otherUser.username}
                    </h2>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesByConversation[activeConversation]?.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-xs md:max-w-md ${
                    msg.senderId === userId ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.senderId !== userId && (
                    <div className="flex-shrink-0 mr-3">
                      <img
                        src={msg.sender.profileImage || "/api/placeholder/40/40"}
                        alt={msg.sender.username}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`flex flex-col ${
                      msg.senderId === userId
                        ? "items-end mr-3 bg-blue-500 text-white"
                        : "items-start bg-gray-800 text-gray-100"
                    } rounded-2xl p-2 sm:p-3`}
                  >
                    {msg.senderId !== userId && (
                      <div className="font-semibold text-xs sm:text-sm">
                        {msg.sender.username}
                      </div>
                    )}
                    <div className="text-xs sm:text-sm">{msg.content}</div>
                    <div className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {msg.senderId === userId && (
                    <div className="flex-shrink-0">
                      <img
                        src={msg.sender.profileImage || "/api/placeholder/40/40"}
                        alt={msg.sender.username}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    </div>
                  )}
                </div>
                {msg.id === messagesByConversation[activeConversation].length && (
                  <div ref={messagesEndRef} />
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-[#0a0a0a] backdrop-blur-sm border-t border-gray-800 p-2 sm:p-4">
            <div className="flex items-center bg-gray-800 rounded-full px-2 sm:px-4 py-1 sm:py-2">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="w-full ml-2 bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-500 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="ml-2 p-1 sm:p-2 text-blue-400 hover:text-blue-300 transition-colors"
                onClick={sendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Yeni Mesaj Modal */}
        {showNewMessageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#0a0a0a] p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Yeni Mesaj</h2>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-gray-400 hover:text-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                className="w-full bg-gray-800 rounded-full py-2 px-4 mb-4 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto">
                {searchedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-2 hover:bg-gray-900 cursor-pointer"
                    onClick={() => handleConversationSelect(user.id)}
                  >
                    <img
                      src={user.profileImage || "/api/placeholder/40/40"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span>{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}