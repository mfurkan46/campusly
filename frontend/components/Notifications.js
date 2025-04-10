"use client"
import { useState } from 'react';
import { Bell, Heart, Repeat, MessageCircle, User, Users, Calendar, Filter } from 'lucide-react';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');

  // Demo bildirim verileri
  const notifications = [
    {
      id: 1,
      type: 'like',
      users: [
        { id: 1, name: 'Ayşe Yılmaz', username: 'ayseyilmaz', avatar: '/api/placeholder/40/40' }
      ],
      content: 'Türkiye\'nin teknoloji girişimleri hakkındaki gönderinizi beğendi',
      time: '2 saat önce',
    },
    {
      id: 2,
      type: 'follow',
      users: [
        { id: 2, name: 'Mehmet Kaya', username: 'mehmetkaya', avatar: '/api/placeholder/40/40' }
      ],
      content: 'sizi takip etmeye başladı',
      time: '5 saat önce',
    },
    {
      id: 3,
      type: 'retweet',
      users: [
        { id: 3, name: 'Can Demir', username: 'candemir', avatar: '/api/placeholder/40/40' },
        { id: 4, name: 'Zeynep Ak', username: 'zeynepak', avatar: '/api/placeholder/40/40' }
      ],
      content: 'Web geliştirme ipuçları hakkındaki gönderinizi yeniden paylaştı',
      time: '1 gün önce',
    },
    {
      id: 4,
      type: 'mention',
      users: [
        { id: 5, name: 'Selin Taş', username: 'selintash', avatar: '/api/placeholder/40/40' }
      ],
      content: 'Next.js projesi hakkında sizi bir gönderide etiketledi',
      time: '2 gün önce',
    },
    {
      id: 5,
      type: 'like',
      users: [
        { id: 6, name: 'Burak Özdemir', username: 'burakozdemir', avatar: '/api/placeholder/40/40' },
        { id: 7, name: 'Deniz Tekin', username: 'deniztekin', avatar: '/api/placeholder/40/40' },
        { id: 8, name: 'Yasemin Kara', username: 'yaseminkara', avatar: '/api/placeholder/40/40' }
      ],
      content: 'Tailwind CSS ile ilgili paylaşımınızı beğendi',
      time: '3 gün önce',
    },
  ];

  // Bildirimleri filtreleme fonksiyonu
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  // Bildirim simgesini belirleyen fonksiyon
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'like': return <Heart className="text-pink-500" size={18} />;
      case 'retweet': return <Repeat className="text-green-400" size={18} />;
      case 'follow': return <User className="text-indigo-400" size={18} />;
      case 'mention': return <MessageCircle className="text-blue-400" size={18} />;
      default: return <Bell className="text-gray-400" size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <main className="md:max-w-6xl max-w-3xl sm:px-2 mx-auto ">
        {/* Üst Başlık */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a] backdrop-blur px-4 py-3 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Bildirimler</h1>
            <button className="rounded-full p-2 hover:bg-gray-800">
              <Filter size={20} />
            </button>
          </div>
          
          {/* Bildirim Sekmeleri */}
          <div className="flex mt-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-3 font-medium relative ${activeTab === 'all' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Tümü
              {activeTab === 'all' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('mention')}
              className={`flex-1 py-3 font-medium relative ${activeTab === 'mention' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Bahsedenler
              {activeTab === 'mention' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full"></div>}
            </button>
            <button 
              onClick={() => setActiveTab('like')}
              className={`flex-1 py-3 font-medium relative ${activeTab === 'like' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Beğeniler
              {activeTab === 'like' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full"></div>}
            </button>
          </div>
        </div>

        {/* Bildirimler Listesi */}
        <div className="divide-y divide-gray-800">
          {filteredNotifications.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              <div className="flex justify-center mb-4">
                <Calendar size={48} />
              </div>
              <p className="text-lg font-medium">Henüz hiç bildiriminiz yok</p>
              <p className="mt-1">Etkileşimleriniz burada görünecek</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div key={notification.id} className="p-4 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1 mb-1 overflow-hidden">
                      {notification.users.slice(0, 3).map(user => (
                        <img 
                          key={user.id} 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full border border-gray-800"
                        />
                      ))}
                      {notification.users.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs">
                          +{notification.users.length - 3}
                        </div>
                      )}
                    </div>
                    <p className="text-sm">
                      <span className="font-bold hover:underline">
                        {notification.users.map(u => u.name).slice(0, 2).join(', ')}
                        {notification.users.length > 2 && ` ve ${notification.users.length - 2} kişi daha`}
                      </span>{' '}
                      {notification.content}
                    </p>
                    <span className="text-xs text-gray-500 mt-1 block">{notification.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}