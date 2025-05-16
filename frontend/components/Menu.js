"use client";
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Info, Clock, AlertCircle } from 'lucide-react';

export default function FoodMenu() {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [availableDates, setAvailableDates] = useState([]);
  const [todayMeal, setTodayMeal] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [weeklyMenus, setWeeklyMenus] = useState([]);

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function formatDateForDisplay(dateStr) {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('tr-TR', options);
  }

  function compareDates(date1, date2) {
    const [day1, month1, year1] = date1.split('.').map(Number);
    const [day2, month2, year2] = date2.split('.').map(Number);
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);
    return d1 - d2;
  }

  function isWeekend(dateStr) {
    const [day, month, year] = dateStr.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDay() === 0 || date.getDay() === 6;
  }

  async function fetchNextAvailableMenuDate(currentDate) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/next/${currentDate}`);
      const data = await response.json();
      if (data.nextDate) {
        return data.nextDate;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async function fetchMenuByDate(date) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/date/${date}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menus/weekly`)
      .then(res => res.json())
      .then(data => {
        setWeeklyMenus(data);
        const dates = data.map(meal => meal.date);
        setAvailableDates(dates);

        let todayDateString = getCurrentDate();


        if (isWeekend(todayDateString)) {
          fetchNextAvailableMenuDate(todayDateString).then(nextDate => {
            if (nextDate) {
              setSelectedDate(nextDate);
              const nextIndex = dates.findIndex(date => date === nextDate);
              setSelectedDateIndex(nextIndex !== -1 ? nextIndex : -1);
            } else {
              setSelectedDateIndex(-1);
            }
          });
        } else {
          setSelectedDate(todayDateString);
          const todayIndex = dates.findIndex(date => date === todayDateString);
          if (todayIndex !== -1) {
            setSelectedDateIndex(todayIndex);
          } else {
            fetchNextAvailableMenuDate(todayDateString).then(nextDate => {
              if (nextDate) {
                setSelectedDate(nextDate);
                const nextIndex = dates.findIndex(date => date === nextDate);
                setSelectedDateIndex(nextIndex !== -1 ? nextIndex : -1);
              } else {
                setSelectedDateIndex(-1);
              }
            });
          }
        }
      })
      .catch(error => console.error('Haftalık menüler alınamadı:', error));
  }, []);

  useEffect(() => {
    fetchMenuByDate(selectedDate).then(menu => {
      setTodayMeal(menu || null);
    });
  }, [selectedDate]);

  const navigateDate = async (direction) => {
    if (selectedDateIndex === -1) {
      if (direction > 0) {
        const nextMenuDate = await fetchNextAvailableMenuDate(selectedDate);
        if (nextMenuDate) {
          const nextIndex = availableDates.findIndex(date => date === nextMenuDate);
          setSelectedDateIndex(nextIndex);
          setSelectedDate(nextMenuDate);
        }
      }
      return;
    }

    const newIndex = selectedDateIndex + direction;
    if (newIndex >= 0 && newIndex < availableDates.length) {
      setSelectedDateIndex(newIndex);
      setSelectedDate(availableDates[newIndex]);
    }
  };

  const calculateTotalCalories = (meal) => {
    if (!meal) return 0;
    return meal.mainDish.calories + meal.sideDish.calories + meal.starter.calories + meal.extra.calories;
  };

  const renderMealCard = (title, item, icon) => {
    if (!item) return null;
    return (
      <div className="bg-gray-800 p-5 rounded-xl shadow-lg transform transition-all hover:scale-105">
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="ml-2 font-medium text-gray-300">{title}</h3>
        </div>
        <p className="text-xl font-bold text-white mb-1">{item.name}</p>
        <div className="flex items-center">
          <div className="h-1 w-12 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-green-400 font-medium">{item.calories} kal</span>
        </div>
      </div>
    );
  };

  return (
    <div className="text-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-4 md:mb-0">
            Yemekhane Menüsü
          </h1>
          <div className="flex items-center bg-gray-800 rounded-xl p-2 shadow-lg">
            <button
              onClick={() => navigateDate(-1)}
              disabled={selectedDateIndex <= 0 || selectedDateIndex === -1}
              className={`p-2.5 rounded-lg ${selectedDateIndex <= 0 || selectedDateIndex === -1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="relative mx-2 px-4 py-2 min-w-48 text-center">
              <Calendar size={18} className="inline-block mr-2 text-blue-400" />
              <span className="font-medium text-white">
                {selectedDate && formatDateForDisplay(selectedDate)}
              </span>
            </div>
            <button
              onClick={() => navigateDate(1)}
              disabled={
                (selectedDateIndex === availableDates.length - 1 && selectedDateIndex !== -1) ||
                selectedDateIndex === -1
              }
              className={`p-2.5 rounded-lg ${
                (selectedDateIndex === availableDates.length - 1 && selectedDateIndex !== -1) ||
                selectedDateIndex === -1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        {todayMeal ? (
          <div className="mb-10">
            <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-t-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Clock size={20} className="mr-2" />
                Günün Menüsü
              </h2>
              <div className="bg-blue-800 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full flex items-center self-start sm:self-auto">
                <span className="text-xs sm:text-sm font-bold text-blue-200 mr-1">Toplam:</span>
                <span className="text-sm sm:text-lg font-bold text-white">{calculateTotalCalories(todayMeal)} kal</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-b-xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {renderMealCard("Ana Yemek", todayMeal.mainDish,
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">ANA</span>
                  </div>
                )}
                {renderMealCard("Tamamlayıcı", todayMeal.sideDish,
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">YAN</span>
                  </div>
                )}
                {renderMealCard("Başlangıç", todayMeal.starter,
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">BŞL</span>
                  </div>
                )}
                {renderMealCard("Ekstra", todayMeal.extra,
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">EKS</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 text-center mb-10 shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
              <AlertCircle size={32} className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Menü Bulunamadı</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {availableDates.length > 0
                ? "Seçtiğiniz tarih için menü bulunmamaktadır. İleri butonuna tıklayarak bir sonraki menüyü görüntüleyebilirsiniz."
                : "Bu hafta için menü bulunmamaktadır. Lütfen daha sonra tekrar kontrol ediniz."}
            </p>
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-300 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-400" />
            Haftalık Menü
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyMenus.map((meal, index) => (
              <div
                key={meal.date}
                className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${selectedDate === meal.date ? 'ring-2 ring-blue-500' : 'hover:bg-gray-750'}`}
                onClick={() => {
                  setSelectedDate(meal.date);
                  setSelectedDateIndex(index);
                }}
              >
                <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-4 py-3 flex justify-between items-center">
                  <span className="font-bold text-white">{formatDateForDisplay(meal.date)}</span>
                  <span className="text-xs bg-blue-900 text-blue-200 px-2.5 py-1 rounded-full font-medium">
                    {calculateTotalCalories(meal)} kal
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-white mb-2">{meal.mainDish.name}</p>
                  <p className="text-sm text-gray-400">{meal.starter.name}, {meal.sideDish.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-start">
            <Info size={24} className="mr-3 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-white mb-2">Bilgilendirme</h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Menü bilgileri haftalık olarak güncellenmektedir.</li>
                <li>• Besin değeri ve içerikler hakkında daha fazla bilgi için yemekhane yönetimi ile iletişime geçiniz.</li>
                <li>• Menü değişiklik gösterebilir. Güncel menüyü takip etmek için uygulamamızı düzenli kontrol ediniz.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}