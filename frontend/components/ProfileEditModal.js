"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiX, FiCamera, FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";

export default function ProfileEditModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    faculty: user?.faculty || "",
    department: user?.department || "",
    location: user?.location || "",
    website: user?.website || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [previewImage, setPreviewImage] = useState(user?.profileImage || "");
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const fileInputRef = useRef(null);

  // Fakülte ve bölüm verileri
  const facultyDepartmentData = {
    "Diş Hekimliği Fakültesi": [
      "Klinik Bilimler",
      "Temel Bilimler"
    ],
    "Eğitim Fakültesi": [
      "Yabancı Diller Eğitimi",
      "Özel Eğitim Öğretmenliği",
      "Türkçe ve Sosyal Bilimler Eğitimi",
      "Matematik ve Fen Bilimleri Eğitimi",
      "Eğitim Bilimleri",
      "Özel Eğitim"
    ],
    "Fen Fakültesi": [
      "Biyoloji",
      "Fizik",
      "Matematik",
      "Kimya"
    ],
    "İnsan Ve Toplum Bilimleri Fakültesi": [
      "Arkeoloji",
      "Batı Dilleri ve Edebiyatları",
      "Coğrafya",
      "Felsefe",
      "Mütercim ve Tercümanlık",
      "Psikoloji",
      "Sanat Tarihi",
      "Tarih",
      "Türk Dili ve Edebiyatı",  
    ],
    "Güzel Sanatlar Fakültesi": [
      "Resim",
      "Tekstil ve Moda Tasarımı",
      "Müzik",
      "Endüstriyel Tasarım",
      "Radyo, Televizyon ve Sinema",
      "İç Mimarlık",
      "Grafik Tasarım",
    ],
    "İktisadi Ve İdari Bilimler Fakültesi": [
      "İktisat",
      "İşletme",
      "Kamu Yönetimi",
      "Sağlık Yönetimi",
      "Sosyal Hizmet",
      "Siyaset Bilimi ve Uluslararası İlişkiler",
      "Uluslararası Ticaret ve Logistik",
    ],
    "İlahiyat Fakültesi": [
      "İlahiyat",
    ],
    "Mühendislik Ve Mimarlık Fakültesi": [
      "Elektrik-Elektronik Mühendisliği",
      "Bilgisayar Mühendisliği",
      "Çevre Mühendisliği",
      "Endüstri Mühendisliği",
      "Gıda Mühendisliği",
      "İnşaat Mühendisliği",
      "Jeoloji Mühendisliği",
      "Makine Mühendisliği",
      "Mimarlık",
      "Tekstil Mühendisliği",
    ],
    "Orman Fakültesi": [
      "Orman Mühendisliği",
      "Orman Endüstri Mühendisliği",
      "Peyzaj Mimarlığı",
    ],
    "Sağlık Bilimleri Fakültesi": [
      "Ebelik",  
      "Hemşirelik",
      "Fizyoterapi ve Rehabilitasyon",
      "Beslenme ve Diyetetik",
      "Dil ve Konuşma Terapisi",
      "Ergoterapi",
    ],
    "Spor Bilimleri Fakültesi": [
      "Beden Eğitimi ve Spor",
      "Antrenörlük Eğitimi",
      "Spor Yöneticiliği",
      "Rekreasyon",
      
    ],
    "Tıp Fakültesi": [
      "Cerrahi Tıp Bilimleri",
      "Dahili Tıp Bilimleri",
      "Temel Tıp Bilimleri",
    ],
    "Ziraat Fakültesi": [
      "Bahçe Bitkileri",
      "Bitki Koruma",
      "Biyosistem Mühendisliği",
      "Tarım Ekonomisi",
      "Tarımsal Biyoteknoloji",
      "Tarla Bitkileri",
      "Toprak Bilimi ve Bitki Besleme",
      "Zootekni",

    ],
    "Afşin Sağlık Yüksekokulu": [
      "Hemşirelik",
      "Ebelik",
    ],
    "Göksun Uygulamalı Bilimler Yüksekokulu": [
      "Bankacılık ve Finans",
      "Halkla İlişkiler ve Reklamcılık",
      "Yeni Medya ve İletişim",  
    ],
    "Yabancı Diller Yüksekokulu": [
      "İngilizce Hazırlık Programı",
    ],

    "Afşin Meslek Yüksekokulu": [
     "Bilgisayar Programcılığı",
     "İşci Sağlığı ve Güvenliği",
     "Özel Güvenlik ve Koruma",
     "Büro Yönetimi ve Yönetici Asistanlığı",
     "Muhasebe ve Vergi Uygulamaları",
     "Kimya Teknolojisi",
     "Maden Teknolojisi",
  ],
  "Andırın Meslek Yüksekokulu": [
    "Bilgisayar Programcılığı",
    "Bahçe Tarımı",
    "Ormancılık ve Orman Ürünleri",
    "Elektrik Enerjisi Üretim, İletim ve Dağıtımı",
    "Yapı Denetimi",
  ],
  "Göksun Meslek Yüksekokulu": [
    "İnternet Programcılığı",
    "Bilgisayar Programcılığı",
    "Organik Tarım",
    "Çocuk Gelişimi",
    "Dış Ticaret",
    "Bankacılık ve Sigortacılık",
    "Harita ve Kadastro",
    "Tapu ve Kadastro",
    "Muhasebe ve Vergi Uygulamaları",
    "İlk ve Acil Yardım",
    "İşletme Yönetimi",
  ],
  "Pazarcık Meslek Yüksekokulu": [
    "Çağrı Merkezi Hizmetleri ve Yönetimi",
    "Dış Ticaret",
    "Adalet",
    "Sosyal Güvenlik",
    "Postacılık Hizmetleri",
    "İşletme Yönetimi",
    "Yerel Yönetimler",

  ],
  "Kahramanmaraş Sağlık Hizmetleri Meslek Yüksekokulu": [
    "Tıbbi Laboratuvar Teknikleri",
    "Tıbbi Dokümantasyon ve Sekreterlik",
    "Anestezi",
    "Optisyenlik",
    "Tıbbi Görüntüleme Teknikleri",
    "İlk ve Acil Yardım",
    "Patoloji Laboratuvarı Teknikleri",
    "Odyometri",
    "Çocuk Gelişimi",
    "Yaşlı Bakımı",
    "Diş Protez Teknolojisi",
    "Ağız ve Diş Sağlığı",
    "Fizyoterapi",
  ],
  "Sosyal Bilimler Meslek Yüksekokulu": [
    "Büro Yönetimi ve Yönetici Asistanlığı",
    "Çağrı Merkezi Hizmetleri",
    "Bankacılık ve Sigortacılık",
    "Maliye",
    "Muhasebe ve Vergi Uygulamaları",
    "Aşçılık",
    "Turizm ve Otel İşletmeciliği",
    "Halkla İlişkiler ve Tanıtım",
    "Pazarlama",
    "İşletme Yönetimi",
    "Lojistik",
  ],
  "Teknik Bilimler Meslek Yüksekokulu": [
    "Bilgisayar Programcılığı",
    "Bilgisayar Destekli Tasarım ve Animasyon",
    "Geleneksel El Sanatları",
    "Kuyumculuk ve Takı Tasarımı",
    "Eloktronik Teknolojisi",
    "Kontrol ve Otomasyon Teknolojisi",
    "Elektrik",
    "Doğalgaz ve Tesisatı Teknolojisi",
    "İklimlendirme ve Soğutma Teknolojisi",
    "İnşaat Teknolojisi",
    "Makine",
    "Otomotiv Teknolojisi",
    "Tekstil Teknolojisi",
    "Giyim Üretim Teknolojisi",
    "Mimari Restorasyon",
    "Gıda Teknolojisi",
    "Mobilya ve Dekorasyon",
    "Moda Tasarımı",
  ]
  };

  // Fakülte listesini ayarla
  useEffect(() => {
    setFacultyOptions(Object.keys(facultyDepartmentData));
  }, []);

  // Fakülte değiştiğinde bölüm listesini güncelle
  useEffect(() => {
    if (formData.faculty) {
      setDepartmentOptions(facultyDepartmentData[formData.faculty] || []);
      
      // Eğer seçili bölüm, yeni fakülte altında yoksa, bölüm seçimini sıfırla
      if (!facultyDepartmentData[formData.faculty]?.includes(formData.department)) {
        setFormData(prev => ({ ...prev, department: "" }));
      }
    } else {
      setDepartmentOptions([]);
    }
  }, [formData.faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};

    // Profil doğrulamaları
    if (activeTab === "profile") {
      if (!formData.username.trim()) {
        newErrors.username = "Kullanıcı adı boş olamaz";
      } else if (formData.username.length < 3) {
        newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır";
      }

      if (formData.bio && formData.bio.length > 160) {
        newErrors.bio = "Biyografi en fazla 160 karakter olabilir";
      }
    }
    // Şifre doğrulamaları
    else if (activeTab === "password") {
      if (!passwordData.currentPassword) {
        newErrors.currentPassword = "Mevcut şifre gerekli";
      }

      if (!passwordData.newPassword) {
        newErrors.newPassword = "Yeni şifre gerekli";
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = "Şifre en az 8 karakter olmalıdır";
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Şifreler eşleşmiyor";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updateData = new FormData();
      
      if (activeTab === "profile") {
        // Profil verilerini ekle
        Object.keys(formData).forEach(key => {
          updateData.append(key, formData[key]);
        });
        
        // Eğer yeni profil resmi seçildiyse
        if (profileImage && profileImage !== user?.profileImage) {
          updateData.append("profileImage", profileImage);
        }
        
        onSave(updateData, "profile");
      } else {
        // Şifre verilerini ekle
        Object.keys(passwordData).forEach(key => {
          updateData.append(key, passwordData[key]);
        });
        
        onSave(updateData, "password");
      }
    }
  };

  // Escape tuşu ile modalı kapatma
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111111] border-b border-gray-800 p-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-6">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-800 transition cursor-pointer"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-bold">Profili düzenle</h2>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-white text-black font-bold rounded-full px-4 py-1 hover:bg-gray-200 transition cursor-pointer"
          >
            Kaydet
          </button>
        </div>

        <div className="p-4">
          {/* Profil Resmi Seçimi */}
          <div className="relative mb-6 flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700"></div>
              )}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-70 transition"
                onClick={triggerFileInput}
              >
                <FiCamera size={24} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Tab Seçici */}
          <div className="flex border-b border-gray-800 mb-4">
            <button
              className={`flex-1 py-3 font-medium text-center cursor-pointer ${
                activeTab === "profile"
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profil Bilgileri
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center cursor-pointer ${
                activeTab === "password"
                  ? "border-b-2 border-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-900"
              }`}
              onClick={() => setActiveTab("password")}
            >
              Şifre Değiştir
            </button>
          </div>

          {activeTab === "profile" ? (
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Kullanıcı Adı</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-md bg-[#202020] border ${
                    errors.username ? "border-red-500" : "border-gray-700"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Biyografi</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  maxLength="160"
                  className={`w-full p-3 rounded-md bg-[#202020] border ${
                    errors.bio ? "border-red-500" : "border-gray-700"
                  }`}
                ></textarea>
                <div className="flex justify-end text-sm text-gray-500">
                  {formData.bio.length}/160
                </div>
                {errors.bio && (
                  <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Fakülte
                  </label>
                  <div className="relative">
                    <select
                      name="faculty"
                      value={formData.faculty}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md bg-[#202020] border border-gray-700 appearance-none cursor-pointer"
                    >
                      <option value="">Fakülte Seçin</option>
                      {facultyOptions.map((faculty) => (
                        <option key={faculty} value={faculty}>
                          {faculty}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronDown className="text-gray-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Bölüm
                  </label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      disabled={!formData.faculty}
                      className={`w-full p-3 rounded-md bg-[#202020] border border-gray-700 appearance-none ${
                        !formData.faculty ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <option value="">Bölüm Seçin</option>
                      {departmentOptions.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronDown className="text-gray-500" />
                    </div>
                  </div>
                </div>
              </div>



             
            </form>
          ) : (
            <form className="space-y-4">
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1">
                  Mevcut Şifre
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-3 rounded-md bg-[#202020] border ${
                      errors.currentPassword ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1">
                  Yeni Şifre
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-3 rounded-md bg-[#202020] border ${
                      errors.newPassword ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Şifre en az 8 karakter uzunluğunda olmalıdır.
                </p>
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1">
                  Şifreyi Onaylayın
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-3 rounded-md bg-[#202020] border ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-700"
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}