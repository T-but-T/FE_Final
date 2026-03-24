'use client';
import { useState, useEffect } from 'react';
import TopMenu from '@/components/TopMenu';
import Link from 'next/link';
import Image from 'next/image';

export default function ListPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 1. State สำหรับเช็คว่า User ล็อกอินหรือยัง
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 🌟 2. เช็ค Token ทันทีที่โหลดหน้าจอ
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setIsLoggedIn(!!token);

    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`);
        const json = await response.json();
        if (json.success) {
          setRestaurants(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="p-24 text-center font-sans text-gray-500">Loading culinary gems...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <TopMenu />

      <main className="p-6 pt-24 pb-10 max-w-5xl mx-auto flex flex-col gap-12">
        {restaurants.length > 0 ? (
          restaurants.map((venue) => (
            <div key={venue.id} className="flex flex-col md:flex-row gap-8 w-full border-b border-gray-200 pb-12 last:border-0">

              {/* ฝั่งซ้าย: รูปภาพและปุ่มแอคชัน */}
              <div className="w-full md:w-1/3 flex flex-col">
                <div className="relative w-full aspect-[4/3] rounded-lg mb-4 overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                  <Image
                    src={venue.image || '/img/default-restaurant.jpg'}
                    alt={venue.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <h2 className="text-2xl font-bold mb-1 text-gray-900">{venue.name}</h2>

                <div className="text-yellow-400 text-lg mb-4 flex gap-1">
                  ★ ★ ★ ★ <span className="text-gray-200">★</span>
                </div>

                {/* 🌟 3. เงื่อนไขการแสดงปุ่มจองและการแจ้งเตือน */}
                {isLoggedIn ? (
                  // เคสที่ 1: ล็อกอินแล้ว -> ให้กดจองได้ปกติ
                  <Link href={`/restaurants/${venue.id}`}>
                    <button className="bg-[#5C5CFF] hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-md transition duration-300 w-fit text-sm shadow-md active:scale-95">
                      Click to reserve
                    </button>
                  </Link>
                ) : (
                  // เคสที่ 2: ยังไม่ล็อกอิน -> บล็อกปุ่ม + โชว์ Text แดงกระพริบ
                  <div className="flex flex-col gap-2.5">
                    <button
                      disabled
                      className="bg-gray-200 text-gray-400 cursor-not-allowed font-bold py-2.5 px-8 rounded-md w-fit text-sm border border-gray-300"
                    >
                      Click to reserve
                    </button>
                    <p className="text-red-600 text-[13px] font-semibold animate-pulse flex items-center gap-1">
                      <span>* Please</span>
                      <Link href="/login" className="underline hover:text-red-800 transition-colors decoration-2">login</Link>
                      <span>to make a reservation</span>
                    </p>
                  </div>
                )}
              </div>

              {/* ฝั่งขวา: รายละเอียดร้านอาหาร */}
              <div className="w-full md:w-2/3 flex flex-col justify-center gap-5 text-gray-700">
                <div className="flex flex-col gap-1 border-l-4 border-gray-100 pl-4 py-1">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Address</span>
                  <p className="text-gray-800 font-medium">
                    {venue.address} {venue.district} {venue.province}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-l-4 border-gray-100 pl-4 py-1">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Information</span>
                  <p className="text-gray-600 leading-relaxed italic">
                    {venue.description || 'No detailed information available at the moment.'}
                  </p>
                </div>

                <div className="flex flex-col gap-1 border-l-4 border-gray-100 pl-4 py-1">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-400">Telephone</span>
                  <p className="text-[#5C5CFF] font-bold">{venue.tel}</p>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <span className="text-5xl">🍽️</span>
            <p className="text-gray-400 font-medium">No restaurants found in our database.</p>
          </div>
        )}
      </main>
    </div>
  );
}