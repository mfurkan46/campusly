"use client";
import Link from 'next/link';
import { Hash, MessageCircle, User, Home, Utensils } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const MobileBottomBar = () => {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Anasayfa', path: '/' },
    { icon: Hash, label: 'Keşfet', path: '/explore' },
    { icon: MessageCircle, label: 'Mesajlar', path: '/messages' },
    { icon: Utensils, label: 'Yemekhane', path: '/menu' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-2 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link href={item.path} key={index}>
              <motion.div 
                className="flex flex-col items-center py-1"
                whileTap={{ scale: 0.9 }}
              >
                <IconComponent 
                  size={22} 
                  className={`${isActive ? 'text-blue-400' : 'text-gray-500'}`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={`text-xs mt-1 ${isActive ? 'text-blue-400 font-medium' : 'text-gray-500'}`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="indicator"
                    className="h-1 w-1 bg-blue-400 rounded-full mt-1"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomBar;