'use client'
import { useState, use, useEffect } from 'react';
import TopMenu from '@/components/TopMenu';
import ReviewBox from '@/components/ReviewBox'; // 🌟 Import
import RestaurantInfo from '@/components/RestaurantInfo'; // 🌟 Import

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReservationPage({ params }: PageProps) {
  const { id } = use(params);

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [reserveDate, setReserveDate] = useState("");
  const [reserveTime, setReserveTime] = useState("");
  // ✂️ ลบ State rating ออกไปแล้ว เพราะย้ายไปอยู่ ReviewBox แทน

  useEffect(() => {
    const now = new Date();
    setReserveDate(now.toISOString().split('T')[0]);

    const currentTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false
    });
    setReserveTime(currentTime);

    const fetchRestaurantDetail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}`);
        const json = await response.json();
        if (json.success) setRestaurant(json.data);
      } catch (error) {
        console.error('Error fetching restaurant detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRestaurantDetail();
  }, [id]);

  const handleReservation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return alert("Please login first to make a reservation");
      if (!reserveTime) return alert("Please select a reservation time.");

      const isWithinHours = reserveTime >= restaurant.openTime && reserveTime <= restaurant.closeTime;
      if (!isWithinHours) return alert(`Sorry, this restaurant is open from ${restaurant.openTime} to ${restaurant.closeTime}`);

      const bookingDateTime = new Date(`${reserveDate}T${reserveTime}:00`).toISOString();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingDate: bookingDateTime }),
      });

      const json = await response.json();

      if (response.ok) {
        alert("Reservation Successful!");
        window.location.href = '/profile'; // แนะนำให้เด้งไปหน้า Profile หลังจองเสร็จครับ
      } else {
        alert(json.message || "Failed to make a reservation");
      }
    } catch (error) {
      console.error('Reservation Error:', error);
      alert("Server error. Please try again later.");
    }
  };

  if (loading) return <div className="p-24 text-center mt-20 text-xl font-sans">Loading restaurant details...</div>;
  if (!restaurant) return <div className="p-24 text-center mt-20 text-xl text-red-500 font-sans">Restaurant not found.</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <TopMenu />

      <main className="p-6 pt-24 max-w-5xl mx-auto flex flex-col gap-6 pb-20">

        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{restaurant.name}</h1>
          <div className="flex items-center gap-2 text-xl">
            <div className="text-yellow-400 flex">
              {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
            </div>
            <span className="text-base text-gray-600 font-medium">(4.5)</span>
          </div>
        </div>

        {/* Hero Section & Reservation Form */}
        <div className="flex flex-col md:flex-row gap-8 w-full mt-4">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-100 w-full aspect-4/3 relative overflow-hidden rounded-lg shadow-md border border-gray-200">
              <img
                src={restaurant.image || '/img/default-restaurant.jpg'}
                alt={restaurant.name}
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
            <div className="bg-gray-50 p-8 w-full max-w-87.5 flex flex-col items-center gap-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Select Date & Time</h3>

              <div className="bg-white px-4 py-3 w-full flex items-center gap-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="text-xl">📅</span>
                <input
                  type="date"
                  value={reserveDate}
                  onChange={(e) => setReserveDate(e.target.value)}
                  onClick={(e) => (e.target as any).showPicker?.()}
                  className="w-full outline-none bg-transparent text-lg font-medium cursor-pointer"
                />
              </div>

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
                onClick={handleReservation}
                className="w-full bg-[#5C5CFF] text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-md mt-2"
              >
                RESERVE NOW
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* 🌟 เรียกใช้ Components ที่แยกไว้ */}
        <RestaurantInfo restaurant={restaurant} />
        <ReviewBox />

      </main>
    </div>
  );
}