"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false);
  const router = useRouter();
  
  // StudentId değiştiğinde email'i otomatik olarak güncelle
  useEffect(() => {
    if (!isLogin && studentId && !emailManuallyEdited) {
      setEmail(`${studentId}@ogr.ksu.edu.tr`);
    }
  }, [studentId, isLogin, emailManuallyEdited]);

  // İsLogin değiştiğinde email'i sıfırla
  useEffect(() => {
    setEmail('');
    setEmailManuallyEdited(false);
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
      console.log(data);
      if (res.ok) {
        // Başarılı giriş
        router.replace("/profile")
      }else{
        console.error(data.error);
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
      console.log(data);
      if (res.ok) {
        // Başarılı giriş
        router.replace("/")
        console.log("Kayıt başarılı");
      }else{
        console.error(data.error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 px-4">
      
      <main className="flex items-center justify-center w-full">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-3xl shadow-lg border border-gray-700">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center">
               <Image src="/logo2.png" alt="Logo" width={64} height={64} />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-blue-300">
              {isLogin ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
            </h2>
          </div>
          
          <div className="flex rounded-full shadow-sm p-1 bg-gray-700">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`px-4 py-3 w-1/2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                isLogin ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-gray-600'
              }`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`px-4 py-3 w-1/2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                !isLogin ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-gray-300 hover:bg-gray-600'
              }`}
            >
              Kayıt Ol
            </button>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                      Öğrenci Numarası
                    </label>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      pattern="[0-9]{11}"
                      maxLength={11}
                      required={!isLogin}
                      className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                      placeholder="11 haneli öğrenci numarası"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                      Kullanıcı Adı
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                      placeholder="Kullanıcı adınız"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                  E-posta
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  pattern=".*@ogr\.ksu\.edu\.tr"
                  required
                  className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  placeholder="ornek@ogr.ksu.edu.tr"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-2 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>
              </div>
            </div>
            

            
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-full shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
              >
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}