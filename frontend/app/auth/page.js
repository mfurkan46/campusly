"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Mail, Key, LockKeyhole, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    if (!isLogin && studentId && !emailManuallyEdited) {
      setEmail(`${studentId}@ogr.ksu.edu.tr`);
    }
  }, [studentId, isLogin, emailManuallyEdited]);

  useEffect(() => {
    setEmail('');
    setEmailManuallyEdited(false);
    setError(null);
  }, [isLogin]);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailManuallyEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (isLogin) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include",
        });
        const data = await res.json();
        
        if (res.ok) {
         
          router.replace("/profile")
        } else {
          setError(data.error || "Giriş yapılırken bir hata oluştu");
        }
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            username,
            email,
            password,
          }),
          credentials: "include",
        });
        const data = await res.json();
        
        if (res.ok) {
          
          router.replace("/")
        } else {
          setError(data.error || "Kayıt olurken bir hata oluştu");
        }
      }
    } catch (err) {
      setError("Bir bağlantı hatası oluştu");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 px-4">
      <main className="flex items-center justify-center w-full">
        <motion.div 
          className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-3xl shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Logo */}
            <motion.div 
              className="flex justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
               <Image src="/logo2.png" alt="Logo" width={64} height={64} />
            </motion.div>
            <motion.h2 
              className="mt-6 text-3xl font-extrabold text-blue-300"
              variants={itemVariants}
            >
              {isLogin ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
            </motion.h2>
          </motion.div>
          
          <motion.div 
            className="flex rounded-full shadow-sm p-1 bg-gray-700"
            variants={itemVariants}
          >
            <motion.button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`px-4 py-3 w-1/2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                isLogin ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={!isLogin ? { backgroundColor: "rgba(75, 85, 99, 0.5)" } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn size={16} className="mr-2" />
              Giriş Yap
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`px-4 py-3 w-1/2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${
                !isLogin ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-gray-600'
              }`}
              whileHover={isLogin ? { backgroundColor: "rgba(75, 85, 99, 0.5)" } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus size={16} className="mr-2" />
              Kayıt Ol
            </motion.button>
          </motion.div>
          
          <motion.form 
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-5">
              {!isLogin && (
                <>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                      Öğrenci Numarası
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="studentId"
                        name="studentId"
                        type="text"
                        pattern="[0-9]{11}"
                        maxLength={11}
                        required={!isLogin}
                        className="block w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                        placeholder="11 haneli öğrenci numarası"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                      Kullanıcı Adı
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="block w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                        placeholder="Kullanıcı adınız"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </motion.div>
                </>
              )}
              
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                  E-posta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    pattern=".*@ogr\.ksu\.edu\.tr"
                    required
                    className="block w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    placeholder="ornek@ogr.ksu.edu.tr"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKeyhole size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <motion.button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 focus:outline-none cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>
            </div>
            
            {error && (
              <motion.div 
                className="mt-2 text-red-400 text-sm flex items-center gap-1 bg-red-900/30 p-3 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="flex justify-center items-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-full shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isLogin ? (
                  <>
                    <LogIn size={18} className="mr-2" />
                    Giriş Yap
                  </>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    Kayıt Ol
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
}