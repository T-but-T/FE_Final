'use client';
import { useState, useEffect } from 'react';
import TopMenu from '@/components/TopMenu';
import RestaurantCard from '@/components/RestaurantCard'; // 🌟 Import เข้ามาใหม่

export default function ListPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
            <RestaurantCard 
              key={venue.id} 
              venue={venue} 
              isLoggedIn={isLoggedIn} 
            />
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