import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Utensils, 
  Salad, 
  Soup, 
  GlassWater, 
  TrendingUp, 
  ChevronRight, 
  Loader
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const RightBar = () => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuError, setMenuError] = useState(null);


  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  };


  useEffect(() => {
    const fetchTrendingHashtags = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/explore/trending`);
        if (!response.ok) {
          throw new Error('Failed to fetch trending hashtags');
        }
        const data = await response.json();
        const topTwo = data.slice(0, 2).map((item, index) => ({
          id: index + 1,
          topic: item.name,
          posts: `${item.postCount} paylaşım`,
        }));
        setTrendingTopics(topTwo);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTrendingHashtags();
  }, []);


  useEffect(() => {
    const fetchTodayMenu = async () => {
      try {
        const currentDate = getCurrentDate();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/date/${currentDate}`);
        if (!response.ok) {
          throw new Error('Bugün için menü bulunamadı');
        }
        const data = await response.json();
        setTodayMenu({
          mainDish: { name: data.mainDish.name, calories: data.mainDish.calories },
          sideDish: { name: data.sideDish.name, calories: data.sideDish.calories },
          starter: { name: data.starter.name, calories: data.starter.calories },
          extra: { name: data.extra.name, calories: data.extra.calories },
        });
        setMenuLoading(false);
      } catch (err) {
        setMenuError(err.message);
        setMenuLoading(false);
      }
    };

    fetchTodayMenu();
  }, []);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };


  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 1
  };

  return (
    <div className="mx-10 max-h-[calc(100vh-100px)] sticky top-0 overflow-y-auto pt-2 pb-8 mb-7 px-1 hidden md:block">
      {/* Gündemde Ne Var */}
      <motion.div 
        className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-3 pb-2">
          <div className="flex items-center">
            <TrendingUp size={18} className="text-blue-500 dark:text-blue-400 mr-2" />
            <h2 className="font-bold text-xl mb-1 dark:text-white">Gündemde Ne Var</h2>
          </div>
        </div>
        <div>
          {loading ? (
            <motion.div 
              className="px-3 py-4 text-gray-500 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={spinTransition}
              >
                <Loader size={20} className="text-blue-500" />
              </motion.div>
              <span className="ml-2">Yükleniyor...</span>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="px-3 py-2 text-red-500"
              variants={itemVariants}
            >
              Hata: {error}
            </motion.div>
          ) : trendingTopics.length > 0 ? (
            trendingTopics.map((topic) => (
              <motion.div 
                key={topic.id} 
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-between">
                  <motion.button 
                    className="text-gray-400 hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full p-1 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  ></motion.button>
                </div>
                <Link href={`/explore/${topic.topic.replace('#', '')}`}>
                  <div className="font-bold text-sm dark:text-white hover:underline">{topic.topic}</div>
                </Link>
                <div className="text-xs text-gray-500">{topic.posts}</div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="px-3 py-2 text-gray-500"
              variants={itemVariants}
            >
              Gündem bulunamadı.
            </motion.div>
          )}
        </div>
        <Link href="/explore">
          <motion.div 
            className="p-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl cursor-pointer flex items-center justify-between transition-colors duration-200"
            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          >
            <span className="text-sm">Daha fazla göster</span>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ChevronRight size={16} />
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Yemekhanede Ne Var */}
      <motion.div 
        className="bg-gray-50 dark:bg-gray-800 rounded-xl mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-3 pb-2">
          <div className="flex items-center">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChefHat size={18} className="text-gray-800 dark:text-gray-200 mr-2" />
            </motion.div>
            <h2 className="font-bold text-xl dark:text-white">Yemekhanede Ne Var</h2>
          </div>
        </div>
        <div>
          {menuLoading ? (
            <motion.div 
              className="px-3 py-4 text-gray-500 flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={spinTransition}
              >
                <Loader size={20} className="text-green-500" />
              </motion.div>
              <span className="ml-2">Yükleniyor...</span>
            </motion.div>
          ) : menuError || !todayMenu ? (
            <motion.div 
              className="px-3 py-2 text-gray-500"
              variants={itemVariants}
            >
              Bugün için menü bulunamadı.
            </motion.div>
          ) : (
            <>
              {/* Ana Yemek */}
              <motion.div 
                className="px-3 py-2 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer flex items-center bg-green-50 dark:bg-green-950/50 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Utensils size={16} className="text-green-600 dark:text-green-400 mr-3" />
                </motion.div>
                <div>
                  <div className="font-bold text-sm dark:text-white">{todayMenu.mainDish.name}</div>
                  <div className="text-xs text-gray-500">{todayMenu.mainDish.calories} kal</div>
                </div>
              </motion.div>
              
              {/* Tamamlayıcı */}
              <motion.div 
                className="px-3 py-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer flex items-center bg-yellow-50 dark:bg-yellow-950/50 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Salad size={16} className="text-yellow-600 dark:text-yellow-400 mr-3" />
                </motion.div>
                <div>
                  <div className="text-sm dark:text-white">{todayMenu.sideDish.name}</div>
                  <div className="text-xs text-gray-500">{todayMenu.sideDish.calories} kal</div>
                </div>
              </motion.div>
              
              {/* Başlangıç */}
              <motion.div 
                className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer flex items-center bg-blue-50 dark:bg-blue-950/50 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Soup size={16} className="text-blue-600 dark:text-blue-400 mr-3" />
                </motion.div>
                <div>
                  <div className="text-sm dark:text-white">{todayMenu.starter.name}</div>
                  <div className="text-xs text-gray-500">{todayMenu.starter.calories} kal</div>
                </div>
              </motion.div>
              
              {/* Ekstra */}
              <motion.div 
                className="px-3 py-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer flex items-center bg-purple-50 dark:bg-purple-950/50 transition-colors duration-200"
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div
                  whileHover={{ rotate: 15 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <GlassWater size={16} className="text-purple-600 dark:text-purple-400 mr-3" />
                </motion.div>
                <div>
                  <div className="text-sm dark:text-white">{todayMenu.extra.name}</div>
                  <div className="text-xs text-gray-500">{todayMenu.extra.calories} kal</div>
                </div>
              </motion.div>
            </>
          )}
        </div>
        <Link href="/menu">
          <motion.div 
            className="p-3 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-xl cursor-pointer flex items-center justify-between transition-colors duration-200"
            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
          >
            <span className="text-sm">Daha fazla göster</span>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ChevronRight size={16} />
            </motion.div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default RightBar;