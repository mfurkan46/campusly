import React from 'react';
import { CiAlignRight, CiApple, CiSearch, CiCalendar, CiLocationArrow1, } from 'react-icons/ci';
import { MdOutlineFoodBank } from "react-icons/md";
import { FaArrowAltCircleRight } from "react-icons/fa";

const RightBar = () => {
  // Gündem verileri
  const trendingTopics = [
    { id: 1, category: 'comingsoon', topic: '#comingsoon', posts: 'comingsoon' },
    { id: 2, category: 'comingsoon', topic: '#comingsoon', posts: 'comingsoon' },
    // { id: 3, category: 'Türkiye', topic: '#Tatil', posts: '12.7B' },
    // { id: 4, category: 'Dünya', topic: '#ClimateChange', posts: '52.3B' },
    // { id: 5, category: 'Eğlence', topic: '#MasterChef', posts: '9.8B' },
  ];

  // Yemek önerileri
  const foodSuggestions = [
    { id: 1, name: 'comingsoon', description: 'comingsoon', image: '/api/placeholder/60/60' },
    { id: 2, name: 'comingsoon', description: 'comingsoon', image: '/api/placeholder/60/60' },
    { id: 3, name: 'comingsoon', description: 'comingsoon', image: '/api/placeholder/60/60' },
  ];

  // Etkinlikler
  const events = [
    { id: 1, name: 'comingsoon', date: 'comingsoon', location: 'comingsoon' },
    { id: 2, name: 'comingsoon', date: 'comingsoon', location: 'comingsoon' },
    { id: 3, name: 'comingsoon', date: 'comingsoon', location: 'comingsoon' },
  ];

  return (
    <div className=" mx-10  max-h-[calc(100vh-100px)] sticky top-0 overflow-y-auto pt-2 pb-8 mb-7 px-1 hidden md:block">
      {/* Arama Kutusu */}
      {/* <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CiSearch size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Ara"
            className="bg-gray-100 dark:bg-gray-800 w-full py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div> */}

      {/* Gündemde Ne Var */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
        <div className="p-3 pb-2">
          <h2 className="font-bold text-xl mb-1 dark:text-white">Gündemde Ne Var</h2>
        </div>
        <div>
          {trendingTopics.map((topic) => (
            <div key={topic.id} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">{topic.category}</span>
                <button className="text-gray-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full p-1">
                  
                </button>
              </div>
              <div className="font-bold text-sm dark:text-white">{topic.topic}</div>
              <div className="text-xs text-gray-500">{topic.posts} paylaşım</div>
            </div>
          ))}
        </div>
        <div className="p-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl cursor-pointer flex items-center justify-between">
          <span className="text-sm">Daha fazla göster</span>
          <FaArrowAltCircleRight size={16} />
        </div>
      </div>

      {/* Yemekhanede Ne Var */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-4">
        <div className="p-3 pb-2">
          <div className="flex items-center">
            <MdOutlineFoodBank size={18} className="text-gray-800 dark:text-gray-200 mr-2" />
            <h2 className="font-bold text-xl dark:text-white">Yemekhanede Ne Var</h2>
          </div>
        </div>
        <div>
          {foodSuggestions.map((food) => (
            <div key={food.id} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex">
              <img 
                src={food.image} 
                alt={food.name} 
                className="w-12 h-12 rounded-md object-cover mr-3" 
              />
              <div>
                <div className="font-bold text-sm dark:text-white">{food.name}</div>
                <div className="text-xs text-gray-500">{food.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl cursor-pointer flex items-center justify-between">
          <span className="text-sm">Daha fazla göster</span>
          <FaArrowAltCircleRight size={16} />
        </div>
      </div>

      {/* Etkinlikler */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="p-3 pb-2">
          <div className="flex items-center">
            <CiCalendar size={18} className="text-gray-800 dark:text-gray-200 mr-2" />
            <h2 className="font-bold text-xl dark:text-white">Etkinlikler</h2>
          </div>
        </div>
        <div>
          {events.map((event) => (
            <div key={event.id} className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-0">
              <div className="font-bold text-sm dark:text-white">{event.name}</div>
              <div className="text-xs text-gray-500 flex items-center mt-1">
                <CiCalendar size={12} className="mr-1" />
                {event.date}
              </div>
              <div className="text-xs text-gray-500 mt-1">{event.location}</div>
            </div>
          ))}
        </div>
        <div className="p-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl cursor-pointer flex items-center justify-between">
          <span className="text-sm">Tüm etkinlikleri gör</span>
          <FaArrowAltCircleRight size={16} />
        </div>
      </div>
     
    </div>
  );
};

export default RightBar;