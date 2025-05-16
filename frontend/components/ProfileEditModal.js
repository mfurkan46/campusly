"use client";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Eye,
  EyeOff,
  ChevronDown,
  User,
  FileText,
  BookOpen,
  GraduationCap,
  Lock,
  Save,
} from "lucide-react";

export default function ProfileEditModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    faculty: user?.faculty || "",
    department: user?.department || "",
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
  const [isFocused, setIsFocused] = useState({});

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Fakülte ve bölüm verileri
  const facultyDepartmentData = {
    "Diş Hekimliği Fakültesi": ["Klinik Bilimler", "Temel Bilimler"],
    "Eğitim Fakültesi": [
      "Yabancı Diller Eğitimi",
      "Özel Eğitim Öğretmenliği",
      "Türkçe ve Sosyal Bilimler Eğitimi",
      "Matematik ve Fen Bilimleri Eğitimi",
      "Eğitim Bilimleri",
      "Özel Eğitim",
    ],
    "Fen Fakültesi": ["Biyoloji", "Fizik", "Matematik", "Kimya"],
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
    "İlahiyat Fakültesi": ["İlahiyat"],
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
    "Orman Fakültesi": ["Orman Mühendisliği", "Orman Endüstri Mühendisliği", "Peyzaj Mimarlığı"],
    "Sağlık Bilimleri Fakültesi": [
      "Ebelik",
      "Hemşirelik",
      "Fizyoterapi ve Rehabilitasyon",
      "Beslenme ve Diyetetik",
      "Dil ve Konuşma Terapisi",
      "Ergoterapi",
    ],
    "Spor Bilimleri Fakültesi": ["Beden Eğitimi ve Spor", "Antrenörlük Eğitimi", "Spor Yöneticiliği", "Rekreasyon"],
    "Tıp Fakültesi": ["Cerrahi Tıp Bilimleri", "Dahili Tıp Bilimleri", "Temel Tıp Bilimleri"],
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
    "Afşin Sağlık Yüksekokulu": ["Hemşirelik", "Ebelik"],
    "Göksun Uygulamalı Bilimler Yüksekokulu": [
      "Bankacılık ve Finans",
      "Halkla İlişkiler ve Reklamcılık",
      "Yeni Medya ve İletişim",
    ],
    "Yabancı Diller Yüksekokulu": ["İngilizce Hazırlık Programı"],
    "Afşin Meslek Yüksekokulu": [
      "Bilgisayar Programcılığı",
      "İşçi Sağlığı ve Güvenliği",
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
      "Elektronik Teknolojisi",
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
    ],
  };

  useEffect(() => {
    setFacultyOptions(Object.keys(facultyDepartmentData));
  }, []);

  useEffect(() => {
    if (formData.faculty) {
      setDepartmentOptions(facultyDepartmentData[formData.faculty] || []);
      if (
        !facultyDepartmentData[formData.faculty]?.includes(formData.department)
      ) {
        setFormData((prev) => ({ ...prev, department: "" }));
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

    if (activeTab === "profile") {
      if (!formData.username.trim()) {
        newErrors.username = "Kullanıcı adı boş olamaz";
      } else if (formData.username.length < 3) {
        newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır";
      }

      if (formData.bio && formData.bio.length > 160) {
        newErrors.bio = "Biyografi en fazla 160 karakter olabilir";
      }
    } else if (activeTab === "password") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (activeTab === "profile") {
          const updateData = new FormData();
          Object.keys(formData).forEach((key) => {
            updateData.append(key, formData[key]);
          });

          if (profileImage && profileImage !== user?.profileImage) {
            updateData.append("profileImage", profileImage);
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
            {
              method: "PATCH",
              credentials: "include",
              body: updateData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Profil güncellenemedi");
          }

          const updatedUser = await response.json();
          onSave(updatedUser, "profile");
          toast.success("Profil başarıyla güncellendi!", {
            position: "top-right",
            autoClose: 3000,
          });
          onClose();
        } else if (activeTab === "password") {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Şifre değiştirilemedi");
          }

          const result = await response.json();
          toast.success(result.message, {
            position: "top-right",
            autoClose: 3000,
          });
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          onClose();
        }
      } catch (error) {
        setErrors({ submit: error.message });
        toast.error(`Hata: ${error.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleFocus = (name) => {
    setIsFocused((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name) => {
    setIsFocused((prev) => ({ ...prev, [name]: false }));
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const modalVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const tabVariants = {
    inactive: { opacity: 0.7 },
    active: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const slideVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.2 },
    },
  };

  const getFieldClassName = (name, customClass = "") => {
    const baseClass =
      "w-full p-3 rounded-full bg-transparent border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const errorClass = errors[name]
      ? "border-red-500"
      : isFocused[name]
      ? "border-blue-500"
      : "border-gray-700";
    const focusClass = isFocused[name] ? "bg-[#15181c]" : "bg-[#202020]";

    const elementClass =
      name === "faculty" || name === "department"
        ? "bg-[#202020] text-white appearance-none"
        : "";

    return `${baseClass} ${errorClass} ${focusClass} ${elementClass} ${customClass}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          ref={modalRef}
          className="bg-[#111111] text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
        >
          <div className="sticky top-0 bg-[#111111] border-b border-gray-800 p-4 flex items-center justify-between z-10 rounded-t-2xl">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-800 transition-all duration-200"
              >
                <X size={18} />
              </motion.button>
              <h2 className="text-xl font-bold">Profili Düzenle</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="bg-blue-500 text-white font-bold rounded-full px-6 py-2 hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
            >
              <Save size={16} />
              <span>Kaydet</span>
            </motion.button>
          </div>

          <div className="p-6">
            {/* Profil Resmi Seçimi */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative mb-8 flex justify-center"
            >
              <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-800 relative shadow-xl">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 cursor-pointer transition-all ${
                    previewImage ? "opacity-0 hover:opacity-100" : "opacity-100"
                  }`}
                  onClick={triggerFileInput}
                >
                  <Camera size={28} className="drop-shadow-lg" />
                </motion.div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </motion.div>

            {/* Tab Seçici */}
            <div className="flex border-b border-gray-800 mb-6">
              <motion.button
                variants={tabVariants}
                animate={activeTab === "profile" ? "active" : "inactive"}
                whileHover={{ opacity: 1 }}
                className={`flex-1 py-3 font-medium text-center cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-gray-500 hover:bg-gray-900"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={18} />
                <span>Profil Bilgileri</span>
              </motion.button>
              <motion.button
                variants={tabVariants}
                animate={activeTab === "password" ? "active" : "inactive"}
                whileHover={{ opacity: 1 }}
                className={`flex-1 py-3 font-medium text-center cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === "password"
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-gray-500 hover:bg-gray-900"
                }`}
                onClick={() => setActiveTab("password")}
              >
                <Lock size={18} />
                <span>Şifre Değiştir</span>
              </motion.button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "profile" ? (
                <motion.form
                  key="profile-form"
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {errors.submit && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className=" text-sm p-3 bg-red-500 bg-opacity-10 rounded-lg border border-red-500 border-opacity-30"
                    >
                      {errors.submit}
                    </motion.p>
                  )}

                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <User size={16} className="text-gray-400 mr-2" />
                      <label className="text-sm text-gray-400">
                        Kullanıcı Adı
                      </label>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => handleFocus("username")}
                      onBlur={() => handleBlur("username")}
                      className={getFieldClassName("username", "pl-5")}
                      placeholder="Kullanıcı adınızı girin"
                    />
                    <AnimatePresence>
                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className=" text-sm mt-2 ml-2"
                        >
                          {errors.username}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <FileText size={16} className="text-gray-400 mr-2" />
                      <label className="text-sm text-gray-400">Biyografi</label>
                    </div>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      onFocus={() => handleFocus("bio")}
                      onBlur={() => handleBlur("bio")}
                      rows="3"
                      maxLength="160"
                      className={getFieldClassName(
                        "bio",
                        "rounded-xl resize-none"
                      )}
                      placeholder="Kendinizi kısaca tanıtın"
                    ></textarea>
                    <div className="flex justify-end text-sm text-gray-500 mt-1 mr-2">
                      <motion.span
                        animate={
                          formData.bio.length > 140 ? { color: "#ff9800" } : {}
                        }
                      >
                        {formData.bio.length}
                      </motion.span>
                      /160
                    </div>
                    <AnimatePresence>
                      {errors.bio && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className=" text-sm mt-2 ml-2"
                        >
                          {errors.bio}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <BookOpen size={16} className="text-gray-400 mr-2" />
                        <label className="text-sm text-gray-400">Fakülte</label>
                      </div>
                      <div className="relative">
                        <select
                          name="faculty"
                          value={formData.faculty}
                          onChange={handleChange}
                          onFocus={() => handleFocus("faculty")}
                          onBlur={() => handleBlur("faculty")}
                          className={`${getFieldClassName(
                            "faculty",
                            "appearance-none cursor-pointer pl-5 pr-10 bg-[#202020] text-white border-gray-700 focus:ring-blue-500"
                          )}`}
                        >
                          <option value="" className="bg-[#202020] text-white">
                            Fakülte Seçin
                          </option>
                          {facultyOptions.map((faculty) => (
                            <option
                              key={faculty}
                              value={faculty}
                              className="bg-[#202020] text-white"
                            >
                              {faculty}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="flex items-center mb-2">
                        <GraduationCap
                          size={16}
                          className="text-gray-400 mr-2"
                        />
                        <label className="text-sm text-gray-400">Bölüm</label>
                      </div>
                      <div className="relative">
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          onFocus={() => handleFocus("department")}
                          onBlur={() => handleBlur("department")}
                          disabled={!formData.faculty}
                          className={`${getFieldClassName(
                            "department",
                            `appearance-none pl-5 pr-10 bg-[#202020] text-white border-gray-700 focus:ring-blue-500 ${
                              !formData.faculty
                                ? "opacity-60 cursor-not-allowed"
                                : "cursor-pointer"
                            }`
                          )}`}
                        >
                          <option value="" className="bg-[#202020] text-white">
                            Bölüm Seçin
                          </option>
                          {departmentOptions.map((department) => (
                            <option
                              key={department}
                              value={department}
                              className="bg-[#202020] text-white"
                            >
                              {department}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <motion.form
                  key="password-form"
                  className="space-y-6"
                  onSubmit={handleSubmit}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {errors.submit && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className=" text-sm p-3 bg-red-500 bg-opacity-10 rounded-lg border border-red-500 border-opacity-30"
                    >
                      {errors.submit}
                    </motion.p>
                  )}

                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <Lock size={16} className="text-gray-400 mr-2" />
                      <label className="text-sm text-gray-400">
                        Mevcut Şifre
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        onFocus={() => handleFocus("currentPassword")}
                        onBlur={() => handleBlur("currentPassword")}
                        className={getFieldClassName(
                          "currentPassword",
                          "pl-5 pr-10"
                        )}
                        placeholder="Mevcut şifrenizi girin"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </motion.div>
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.currentPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className=" text-sm mt-2 ml-2"
                        >
                          {errors.currentPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <Lock size={16} className="text-gray-400 mr-2" />
                      <label className="text-sm text-gray-400">
                        Yeni Şifre
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        onFocus={() => handleFocus("newPassword")}
                        onBlur={() => handleBlur("newPassword")}
                        className={getFieldClassName(
                          "newPassword",
                          "pl-5 pr-10"
                        )}
                        placeholder="Yeni şifrenizi girin"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </motion.div>
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.newPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className=" text-sm mt-2 ml-2"
                        >
                          {errors.newPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <motion.p
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-gray-500 mt-2 ml-2"
                    >
                      Şifre en az 8 karakter uzunluğunda olmalıdır.
                    </motion.p>
                  </div>

                  <div className="relative">
                    <div className="flex items-center mb-2">
                      <Lock size={16} className="text-gray-400 mr-2" />
                      <label className="text-sm text-gray-400">
                        Şifreyi Onaylayın
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        onFocus={() => handleFocus("confirmPassword")}
                        onBlur={() => handleBlur("confirmPassword")}
                        className={getFieldClassName(
                          "confirmPassword",
                          "pl-5 pr-10"
                        )}
                        placeholder="Yeni şifrenizi tekrar girin"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </motion.div>
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className=" text-sm mt-2 ml-2"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}