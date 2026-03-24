'use client';
import { useState, useEffect } from 'react';
import TopMenu from '@/components/TopMenu';
import Link from 'next/link';
import Image from 'next/image';

export default function ListPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants`);
        const json = await response.json();
        setRestaurants(json.data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="p-24 text-center">Loading restaurants...</div>;

  return (
    <div className="min-h-screen bg-white text-black">
      <TopMenu />

      <main className="p-6 pt-24 pb-10 max-w-5xl mx-auto flex flex-col gap-12">
        {restaurants.length > 0 ? (
          restaurants.map((venue) => (
            <div key={venue.id} className="flex flex-col md:flex-row gap-8 w-full border-b border-gray-300 pb-10">

              <div className="w-full md:w-1/3 flex flex-col">
                <div className="relative w-full aspect-4/3 rounded-sm mb-4 overflow-hidden bg-gray-200">
                  <Image 
                    src={venue.image || '/img/default-restaurant.jpg'} 
                    alt={venue.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 className="text-2xl font-semibold mb-1">{venue.name}</h2>

                <div className="text-gray-300 text-xl tracking-widest mb-4">
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-200">★</span>
                </div>

                
                <Link href={`/restaurants/${venue.id}`}>
                  <button className="bg-[#5C5CFF] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 w-fit text-sm shadow-sm">
                    Click to reserve
                  </button>
                </Link>
              </div>

              
              <div className="w-full md:w-2/3 flex flex-col justify-center gap-4 text-gray-700 text-sm md:text-base">
                <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                  <span className="w-40 font-medium shrink-0 whitespace-nowrap">Address:</span>
                  <span className="text-gray-600">{venue.address} {venue.district} {venue.province}</span>
                </div>
                <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                  <span className="w-40 font-medium shrink-0 whitespace-nowrap">Information:</span>
                  <span className="text-gray-600">{venue.description || 'No information available'}</span>
                </div>
                <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                  <span className="w-40 font-medium shrink-0 whitespace-nowrap">Telephone:</span>
                  <span className="text-gray-600">{venue.tel}</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <p className="text-center py-20 text-gray-500">No restaurants found in database.</p>
        )}
      </main>
    </div>
  );
}