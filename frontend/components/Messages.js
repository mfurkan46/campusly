"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  MessageSquarePlus,
  Send,
  X,
  ChevronLeft
} from "lucide-react";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

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

  const getProfileImageUrl = (profileImage) => {
    if (!profileImage) {
      return "/default_avatar.png";
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${profileImage}`;
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          credentials: "include",
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
        router.push("/auth");
      }
    };
    fetchUserId();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
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
      }
    };
    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!userId || !activeConversation) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversation/${activeConversation}`,
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
      }
    };
    fetchMessages();
  }, [userId, activeConversation]);

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

  useEffect(() => {
    if (!showNewMessageModal || !searchQuery) {
      setSearchedUsers([]);
      return;
    }
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/search?query=${searchQuery}`,
          {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) {
          const errorData = await res.json();
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
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col h-full fixed md:static left-0 top-0 bottom-0 z-20 bg-[#0a0a0a] w-full md:w-1/3 lg:w-1/4 border-r border-gray-800"
            >
              <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-800 text-gray-100 transition-colors"
                  >
                    <ArrowLeft size={20} />
                  </motion.button>
                  <h1 className="text-xl font-bold">Mesajlar</h1>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNewConversation}
                    className="p-2 rounded-full hover:bg-gray-800 text-blue-400 transition-colors"
                  >
                    <MessageSquarePlus size={20} />
                  </motion.button>
                </div>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Mesajları ara"
                    className="w-full bg-gray-800 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                  />
                  <div className="absolute right-3 top-2 text-gray-400">
                    <Search size={16} />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((convo) => (
                  <motion.div
                    key={convo.otherUser.id}
                    whileHover={{ backgroundColor: "#1a1a1a" }}
                    whileTap={{ backgroundColor: "#222222" }}
                    className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                      activeConversation === convo.otherUser.id ? "bg-gray-900" : ""
                    }`}
                    onClick={() => handleConversationSelect(convo.otherUser.id)}
                  >
                    <div className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-full overflow-hidden mr-3"
                      >
                        <img
                          src={getProfileImageUrl(convo.otherUser.profileImage)}
                          alt={convo.otherUser.username}
                          className="object-cover"
                        />
                      </motion.div>
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
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`${
            !showSidebar ? "flex" : "hidden"
          } md:flex flex-col h-full w-full`}
        >
          <div className="sticky top-0 z-10 bg-[#0a0a0a] backdrop-blur-sm border-b border-gray-800 p-4">
            <div className="flex items-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSidebar(true)}
                className="md:hidden p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={18} />
              </motion.button>
              {activeConversation && (
                <>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-10 h-10 rounded-full overflow-hidden mr-3"
                  >
                    <img
                      src={getProfileImageUrl(
                        conversations.find((c) => c.otherUser.id === activeConversation)
                          ?.otherUser.profileImage
                      )}
                      alt={
                        conversations.find((c) => c.otherUser.id === activeConversation)
                          ?.otherUser.username
                      }
                      className="object-cover"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <h2 className="font-bold">
                      {conversations.find((c) => c.otherUser.id === activeConversation)
                        ?.otherUser.username}
                    </h2>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesByConversation[activeConversation]?.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-xs md:max-w-md ${
                    msg.senderId === userId ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {msg.senderId !== userId && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden">
                        <img
                          src={getProfileImageUrl(msg.sender.profileImage)}
                          alt={msg.sender.username}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
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
                  </motion.div>
                </div>
                {msg.id === messagesByConversation[activeConversation].length && (
                  <div ref={messagesEndRef} />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky bottom-0 bg-[#0a0a0a] backdrop-blur-sm border-t border-gray-800 p-2 sm:p-4"
          >
            <div className="flex items-center bg-gray-800 rounded-full px-2 sm:px-4 py-1 sm:py-2">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                className="w-full ml-2 bg-transparent border-none focus:outline-none text-gray-100 placeholder-gray-500 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="ml-2 p-1 sm:p-2 text-blue-400 hover:text-blue-300 transition-colors"
                onClick={sendMessage}
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showNewMessageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#0a0a0a] p-6 rounded-lg w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Yeni Mesaj</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNewMessageModal(false)}
                    className="text-gray-400 hover:text-gray-100"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    className="w-full bg-gray-800 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute right-3 top-2 text-gray-400">
                    <Search size={16} />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {searchedUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ backgroundColor: "#1a1a1a" }}
                      whileTap={{ backgroundColor: "#222222" }}
                      className="flex items-center p-2 hover:bg-gray-900 cursor-pointer rounded-lg"
                      onClick={() => handleConversationSelect(user.id)}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-full overflow-hidden mr-3"
                      >
                        <img
                          src={getProfileImageUrl(user.profileImage)}
                          alt={user.username}
                          className="object-cover"
                        />
                      </motion.div>
                      <span>{user.username}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}