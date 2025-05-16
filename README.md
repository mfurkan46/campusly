

# 🎓 campusly

campusly, Kahramanmaraş Sütçü İmam Üniversitesi öğrencileri için özel olarak geliştirilmiş modern bir sosyal medya platformudur. Öğrenciler arasında etkileşimi artırmayı, bilgi paylaşımını kolaylaştırmayı ve üniversite yaşamını daha sosyal hale getirmeyi hedefler.



## 🧠 Amaç

Bu platform, yalnızca KSÜ öğrencilerinin katılabildiği güvenli ve özel bir sosyal ortam sunar. Uygulama sayesinde öğrenciler birbirleriyle iletişim kurabilir, gönderiler paylaşabilir ve kampüsle ilgili gelişmeleri takip edebilirler.



## 🛠️ Kullanılan Teknolojiler

### Frontend (📁 `frontend/`)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Responsive mobil uyumlu tasarım

### Backend (📁 `backend/`)
- [Express.js](https://expressjs.com/)
- Katmanlı Mimari: HTTP isteklerini yönlendiren **Routes**, iş mantığını yöneten **Controllers** ve veritabanı işlemlerini gerçekleştiren **Services** katmanlarından oluşur.   
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)



## 📁 Proje Yapısı

```bash
campusly/
├── frontend/   # Kullanıcı arayüzü (Next.js)
└── backend/    # API ve sunucu işlemleri (Express.js)
```

---

## 🖼️ Uygulama Görselleri

Uygulama yalnızca KSÜ öğrencilerine özeldir ve içerik sadece giriş yapan kullanıcılar tarafından görüntülenebilir. Aşağıda uygulamaya ait bazı bölümleri inceleyebilirsiniz:

### 🔐 Kayıt Sayfası

![Giriş Sayfası](images/register.png)  
➡️ *Sadece geçerli öğrenci numarasıyla kayıt olunur. Güvenli ve basit arayüz.*

---
### 🔐 Giriş Sayfası

![Giriş Sayfası](images/login.png)  
➡️ *Sadece geçerli öğrenci numarasıyla giriş yapılır. Güvenli ve basit arayüz.*

---

### 📰 Ana Akış Sayfası

![Ana Akış](images/feed.png)  
➡️ *Gönderilerin kronolojik veya algoritmik sıralamayla görüntülendiği ana sayfa.*

---

### 📄 Post Detay Sayfası

![Post Detay](images/post_detail.png)  
➡️ *Post detay sayfasında, seçilen gönderinin içeriği ve ilgili kullanıcı etkileşimleri (yorumlar, beğeniler vb.) detaylı olarak görüntülenebilir.*

---
### 🙍‍♂️ Profil Sayfası

![Profil Sayfası](images/profile.png)  
➡️ *Profil bilgileri, gönderiler ve bu sayfada yer alır.*

---
### 🙍‍♂️ Diğer Kullanıcı Sayfası

![Diğer Kullanıcı Sayfası](images/another_user.png)  
➡️ *Diğer kullanıcı bilgileri, gönderiler ve bu sayfada yer alır.*

---

### 🔍 Keşfet

![Keşfet Sayfası](images/explore.png)
![Hashtag Detay Sayfası](images/explore2.png) 
➡️ *Kampüs gündemini takip etmeye yönelik özel alan.*

---

### ✏️ Profil Düzenleme ve Şifre Değiştirme Sayfası

![Profil düzenleme modalı](images/profile_edit.png) 
![Şifre değiştirme modalı](images/change_password.png) 
➡️ *Profil bilgilerini düzenlemeye ve şifre değiştirmeye yönelik bir modal sayfası.*

---

### 🍴 Yemekhane Sayfası

![Yemekhane Sayfası](images/menu.png)
➡️ *Bu sayfa, kullanıcıların günlük yemek menüsünü görüntüleyebileceği kullanıcı dostu bir arayüz sunar.*

> 📌 *Görseller zamanla güncellenecektir. Daha fazla ekran görüntüsü eklenecektir.*



## 🚧 Yakında Eklenecek Özellikler

- [x] **Yemekhane Menüsü** – Günlük yemek listesinin gösterimi
- [x] **Postlara Yorum** – Gönderilere yapılan yorumlar
- [x] **Profil Düzenleme** – Kullanıcı bilgilerini güncelleme imkanı
- [x] **Yer İşaretleri** – Gönderileri kaydetme özelliği
- [x] **Hata Mesajları ve Bildirimler** – Kullanıcı deneyimi artırıcı yapılar
- [x] **Animasyonlar** – Akıcı geçişler ve geri bildirimler
- [x] **Akış Algoritması İyileştirmesi** – Kullanıcıya özel gönderi sıralaması
- [x] **Görüntülenme Sistemi** – Gönderi izlenme sayılarının takibi
- [x] **Mobil Alt Menü Düzenlemesi** – Mobil uyumlu gezinme deneyimi

## 🔄 Güncellemeler

| 📅 Tarih         | 📝 Değişiklik |
|------------------|--------------|
| **16 Mayıs 2025** | 👁️ Görüntülenme sistemi eklendi. Akış algoritması iyileştirildi |
| **12 Mayıs 2025** | ✨ Hata mesajları ve animasyonlar eklendi genel cilalama çalışması yapıldı. |
| **7 Mayıs 2025** | 🍴 Yemekhane sayfası ve Yemekhanede Ne Var componenti (Rightbar) eklendi. |
| **4 Mayıs 2025** | 🔑 Şifre değiştirme sistemi eklendi. |
| **1 Mayıs 2025** | ✂️ Postun bağlantısını kopyalama özelliği eklendi. |
| **1 Mayıs 2025** | 🪪 Profil bilgileri düzenleme özelliği eklendi. Postun bağlantısını kopyalama özelliği eklendi. |
| **24 Nisan 2025** | 💬 Postlara yorum yapma özelliği eklendi. |
| **22 Nisan 2025** | 🔖 Yer işaretleri sayfası eklendi. Bottom bar sorunları çözüldü. |
| **12 Nisan 2025** | 📱 Mobil alt menü (bottom bar) eklendi. Navigasyon deneyimi geliştirildi. |


## 🔐 Erişim Kuralları

> **Not:** Bu uygulama yalnızca KSÜ öğrencilerine özeldir.

- 📌 **Kayıt için öğrenci numarası zorunludur.**
- 👁️ **Kayıt olmayan kullanıcılar yalnızca giriş ekranını görebilir.**
- 🔒 **Veriler ve içerikler sadece oturum açmış kullanıcılar tarafından görüntülenebilir.**



## 👨‍💻 Geliştirici

**Bu proje, Kahramanmaraş Sütçü İmam Üniversitesi - Bilgisayar Programcılığı** bölümü **Bitirme Projesi** kapsamında bireysel olarak geliştirilmiştir.

**Geliştirici Bilgileri:**

- **👤 Ad Soyad:** *Muhammed Furkan Demirci*
- **🎓 Okul:** Kahramanmaraş Sütçü İmam Üniversitesi
- **📬 Mail:** *muhammednur2004@gmail.com*
- **💼 LinkedIn:** [Furkan Demirci](https://www.linkedin.com/in/furkan-demirci1)
- **🐙 GitHub:** [mfurkan46](https://github.com/mfurkan46)

> 📬 Bana ulaşmak isterseniz yukarıdaki adreslerden iletişime geçebilirsiniz!



## 💬 Katkı ve Geri Bildirim

Proje bireysel bir çalışma olsa da, fikir ve önerilere her zaman açığım.  
Görüşlerinizi paylaşmak için bir `issue` oluşturabilir veya doğrudan iletişime geçebilirsiniz.



## 📝 Not

> Bu proje **Kahramanmaraş Sütçü İmam Üniversitesi - Bilgisayar Programcılığı** bölümü öğrencisi tarafından **bitirme projesi** olarak geliştirilmiştir.  
> Tüm hakları saklıdır.
