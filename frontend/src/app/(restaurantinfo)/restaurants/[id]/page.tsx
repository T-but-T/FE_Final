'use client'
import { useState, use, useEffect } from 'react';
import TopMenu from '@/components/TopMenu';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReservationPage({ params }: PageProps) {
  const { id } = use(params);

  // State สำหรับข้อมูลร้านและ Loading
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🌟 ตั้งค่าเริ่มต้นเป็นค่าว่าง และใช้ useEffect เซ็ตเวลาปัจจุบัน
  const [reserveTime, setReserveTime] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    // 🌟 1. ฟังก์ชันตั้งเวลาปัจจุบัน (HH:mm)
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    setReserveTime(currentTime);

    // 🌟 2. ดึงข้อมูลรายละเอียดร้านอาหารจาก API
    const fetchRestaurantDetail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurant/${id}`);
        const json = await response.json();

        if (json.success) {
          setRestaurant(json.data);
        } else {
          console.error('Failed to fetch:', json);
        }
      } catch (error) {
        console.error('Error fetching restaurant detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRestaurantDetail();
    }
  }, [id]);

  // หน้าจอตอนกำลังโหลดข้อมูล
  if (loading) return <div className="p-24 text-center mt-20 text-xl font-sans">Loading restaurant details...</div>;

  // กรณีหาข้อมูลร้านไม่เจอ
  if (!restaurant) return <div className="p-24 text-center mt-20 text-xl text-red-500 font-sans">Restaurant not found.</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <TopMenu />

      <main className="p-6 pt-24 max-w-5xl mx-auto flex flex-col gap-6 pb-20">

        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-2 text-xl">
            <div className="text-gray-300 tracking-widest flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">★</span>
              ))}
            </div>
            <span className="text-base text-gray-600 font-medium">(4.5)</span>
          </div>
        </div>

        {/* Hero Section: รูปภาพ และ กล่องจอง */}
        <div className="flex flex-col md:flex-row gap-8 w-full mt-4">
          {/* ฝั่งซ้าย: รูปภาพร้าน */}
          <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
            <div className="bg-gray-100 w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden rounded-lg shadow-md border border-gray-200">
              <img
                src={restaurant.image || '/img/default-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* ฝั่งขวา: กล่องจองเวลา */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
            <div className="bg-gray-50 p-8 w-full max-w-[350px] flex flex-col items-center gap-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Select Time</h3>
              <div className="bg-white px-4 py-3 w-full flex items-center gap-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="text-xl">🕒</span>
                <input
                  type="time"
                  value={reserveTime}
                  onChange={(e) => setReserveTime(e.target.value)}
                  className="w-full outline-none bg-transparent text-lg font-medium cursor-pointer"
                />
              </div>
              <button
                onClick={() => alert(`Reserved for ${reserveTime} at ${restaurant.name}`)}
                className="w-full bg-[#5C5CFF] text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md"
              >
                RESERVE NOW
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Section: รายละเอียดร้าน */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">About this Restaurant</h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {restaurant.description || "No description available for this restaurant yet."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-900">📍 Address:</span>
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-900">📞 Telephone:</span>
                <span>{restaurant.tel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Review Rating */}
        <div className="mt-6 flex flex-col gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="text-lg font-bold text-gray-800">Rate your experience</div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-3xl tracking-widest cursor-pointer flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-colors duration-200 ${star <= rating ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-gray-400"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={() => alert(rating > 0 ? `Sent ${rating} stars review!` : 'Please select rating')}
              className="bg-gray-800 text-white px-10 py-2 rounded-full font-medium hover:bg-black transition-all active:scale-95"
            >
              Send Review
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}