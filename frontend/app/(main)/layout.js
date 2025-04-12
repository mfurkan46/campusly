"use client";
import { usePathname } from "next/navigation"; 
import Header from "@/components/Header";
import LeftBar from "@/components/LeftBar";
import RightBar from "@/components/RightBar";
import Topbar from "@/components/Topbar";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function MainLayout({ children }) {
  const pathname = usePathname(); 
  const isMessagesPage = pathname === "/messages"; 

  return (
    <div className="flex flex-col min-h-screen h-full max-w-screen overflow-x-hidden">
      <div className="md:flex md:flex-row relative md:pt-16">
        <Header />
        { !isMessagesPage && <div className="h-8 sticky z-50 w-full top-0 rounded-2xl md:hidden">
           <Topbar />
        </div>}
        <div className="hidden md:flex md:w-1/6 fixed left-0 h-full top-16">
          <LeftBar />
        </div>
        <div className="w-full md:w-3/5 md:mx-auto pb-15 md:pb-0">
          {children}
        </div>
        <div className="hidden md:flex md:w-1/5 fixed right-0 h-full top-16">
          <RightBar />
        </div>
        { <div className="md:hidden">
           <MobileBottomBar />
        </div>}
      </div>
    </div>
  );
}