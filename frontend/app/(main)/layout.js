"use client";
import { usePathname } from "next/navigation"; // Next.js için rota kontrolü
import Header from "@/components/Header";
import LeftBar from "@/components/LeftBar";
import RightBar from "@/components/RightBar";
import Topbar from "@/components/Topbar";
import { Zap, Hash, MessageCircle, Bell } from "lucide-react";

export default function MainLayout({ children }) {
  const pathname = usePathname(); // Şu anki rotayı alıyoruz
  const isMessagesPage = pathname === "/messages"; // /messages rotasında mıyız?

  return (
    <div className="flex flex-col h-full max-w-screen overflow-x-hidden">
      <div className="md:flex md:flex-row relative md:pt-16">
        <Header />
        {/* Topbar: Mobilde ve /messages değilse göster */}
        { !isMessagesPage && <div className="h-8 sticky z-50 w-full top-0 rounded-2xl md:hidden">
           <Topbar />
        </div>}
        <div className="hidden md:flex md:w-1/6 fixed left-0 h-full top-16">
          <LeftBar />
        </div>
        {children}
        <div className="hidden md:flex md:w-1/5 fixed right-0 h-full top-16">
          <RightBar />
        </div>
        {/* Bottombar: Mobilde ve /messages değilse göster */}
        { !isMessagesPage && <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-2">
          
            <div className="flex justify-around">
              <a href="#" className="p-3">
                <Zap size={24} />
              </a>
              <a href="#" className="p-3 text-purple-500">
                <Hash size={24} />
              </a>
              <a href="#" className="p-3">
                <Bell size={24} />
              </a>
              <a href="#" className="p-3">
                <MessageCircle size={24} />
              </a>
            </div>
          
        </div> }
      </div>
    </div>
  );
}