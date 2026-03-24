'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopMenu from '@/components/TopMenu';

export default function HomePage() {
  const images = [
    '/img/cover1.jpg',
    '/img/cover2.jpg',
    '/img/cover3.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <TopMenu />
    

      <main className="h-screen w-full relative overflow-hidden">

        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${images[currentIndex]}')` }}
        >

          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
            EXQUISITE DINING STARTS HERE
          </h1>
          <p className="text-lg md:text-2xl mb-16 max-w-3xl text-gray-100 drop-shadow-md">
            Discover the finest culinary gems in town and book your table seamlessly.
          </p>

          <Link href="/list" className="mb-12">
            <button className="bg-[#5C5CFF] text-white px-14 py-5 text-xl font-bold 
                               hover:bg-blue-600 transition-all duration-300 shadow-2xl rounded-full">
              EXPLORE RESTAURANTS
            </button>
          </Link>
          
          <div className="flex space-x-2 absolute bottom-10">
            {images.map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}