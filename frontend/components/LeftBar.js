import Link from 'next/link';
import React from 'react';
import { Home, Search, MessageSquare, User, Bookmark, Github } from 'lucide-react';

const list = [
    {
        icon: <Home size={24} strokeWidth={1.5} />,
        name: 'Ana Sayfa',
        href: '/'   
    },
    {
        icon: <Search size={24} strokeWidth={1.5} />,
        name: 'Keşfet',  
        href: '/explore'  
    },
    {
        icon: <MessageSquare size={24} strokeWidth={1.5} />,
        name: 'Mesajlar',
        href: '/messages'   
    },
    {
        icon: <User size={24} strokeWidth={1.5} />,
        name: 'Profil',
        href: '/profile'    
    },
    {
        icon: <Bookmark size={24} strokeWidth={1.5} />,
        name: 'Yer İşaretleri',
        href: '/bookmarks'
    },
];

const LeftBar = () => {
  return (
    <div className="w-full relative p-5 h-full">
        <div className="hidden md:flex md:flex-col gap-3 items-center">
            {list.map((item, index) => (
                <div 
                    key={index} 
                    className="w-[85%] h-14 cursor-pointer hover:bg-gray-800/80 transition-all duration-200 rounded-xl flex justify-center"
                >
                    <Link 
                        href={item.href} 
                        className="gap-3 flex items-center font-semibold text-lg text-gray-100 hover:text-white"
                    >
                        {item.icon} {item.name}
                    </Link>
                </div>
            ))}

                
        </div>
    </div>
  );
};

export default LeftBar;