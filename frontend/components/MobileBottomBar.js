import Link from 'next/link';
import {Hash,  MessageCircle, User, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

const MobileBottomBar = () => {
  const pathname = usePathname();
  

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Hash, label: 'Explore', path: '/explore' },
    { icon: MessageCircle, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-1 z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;
          return (
            <Link href={item.path} key={index}>
              <div className="flex flex-col items-center py-1">
                <IconComponent 
                  size={22} 
                  className={`${isActive ? 'text-blue-400 font-bold' : 'text-gray-500'} transition-colors duration-200`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span className={`text-xs ${isActive ? 'text-blue-400 font-medium' : 'text-gray-500'} transition-colors duration-200`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomBar;