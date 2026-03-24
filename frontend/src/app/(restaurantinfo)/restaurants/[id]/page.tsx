'use client'
import { useState, use, useEffect } from 'react';
import TopMenu from '@/components/TopMenu';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReservationPage({ params }: PageProps) {
  const { id } = use(params);

  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleReservation = () => {
  // 1. Basic validation to ensure time is selected
  if (!reserveTime) {
    alert("Please select a time.");
    return;
  }

  // 2. Check if the selected time is within operating hours
  // Lexicographical comparison works for "HH:mm" strings
  const isOpening = reserveTime >= restaurant.openTime;
  const isClosing = reserveTime <= restaurant.closeTime;

  if (isOpening && isClosing) {
    // Proceed with reservation
    alert(`Reserved for ${reserveDate} at ${reserveTime}`);
    // Your reservation API call would go here
  } else {
    // Show error if outside hours
    alert(
      `Sorry, this restaurant is only open between ${restaurant.openTime} and ${restaurant.closeTime}.`
    );
  }
};

  // States for Booking and Rating
  const [reserveDate, setReserveDate] = useState("");
  const [reserveTime, setReserveTime] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const now = new Date();
    
    // Set default date to today (YYYY-MM-DD)
    setReserveDate(now.toISOString().split('T')[0]);

    // Set default time (HH:mm)
    const currentTime = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    setReserveTime(currentTime);

    const fetchRestaurantDetail = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${id}`);
        const json = await response.json();
        if (json.success) {
          setRestaurant(json.data);
        }
      } catch (error) {
        console.error('Error fetching restaurant detail:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRestaurantDetail();
  }, [id]);

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
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>★</span>
              ))}
            </div>
            <span className="text-base text-gray-600 font-medium">(4.5)</span>
          </div>
        </div>

        {/* Hero Section */}
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

          {/* Reservation Box with Calendar & Time */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
            <div className="bg-gray-50 p-8 w-full max-w-87.5 flex flex-col items-center gap-4 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Select Date & Time</h3>
              
              {/* Date Input - Set to trigger Calendar */}
              <div className="bg-white px-4 py-3 w-full flex items-center gap-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <span className="text-xl">📅</span>
                <input
                  type="date"
                  value={reserveDate}
                  onChange={(e) => setReserveDate(e.target.value)}
                  // This triggers the native calendar picker when clicking the box
                  onClick={(e) => (e.target as any).showPicker?.()} 
                  className="w-full outline-none bg-transparent text-lg font-medium cursor-pointer"
                />
              </div>

              {/* Time Input */}
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

        {/* About Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-4 text-gray-700 text-sm md:text-base">
        <h3 className="text-xl font-bold text-gray-900 mb-2 border-b pb-2">About this Restaurant</h3>
        
        <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
          <span className="w-40 font-medium shrink-0 whitespace-nowrap text-gray-900">📍 Address:</span>
          <span className="text-gray-600">
            {restaurant.address} {restaurant.district} {restaurant.province}
          </span>
        </div>

        <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
          <span className="w-40 font-medium shrink-0 whitespace-nowrap text-gray-900">ℹ️ Information:</span>
          <span className="text-gray-600">
            {restaurant.description || 'No information available'}
          </span>
        </div>

        <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
          <span className="w-40 font-medium shrink-0 whitespace-nowrap text-gray-900">📞 Telephone:</span>
          <span className="text-gray-600">{restaurant.tel}</span>
        </div>

        {/* New Open-Close Time Section */}
        <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
          <span className="w-40 font-medium shrink-0 whitespace-nowrap text-gray-900">🕒 Open-Close:</span>
          <span className="text-gray-600">
            {restaurant.openTime} - {restaurant.closeTime}
          </span>
        </div>
      </div>

        {/* Review Rating Section */}
        <div className="mt-6 flex flex-col gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="text-lg font-bold text-gray-800">Rate your experience</div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-3xl tracking-widest cursor-pointer flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-colors duration-200 ${
                    star <= rating ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-gray-400"
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