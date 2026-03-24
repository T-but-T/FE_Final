'use client'; 
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Banner() {
  const images = [
    '/img/cover1.jpg',
    '/img/cover2.jpg',
    '/img/cover3.jpg'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeImage = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return;
    
    setIsTransitioning(true); 
    setCurrentIndex(newIndex); 
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000);
  };

  const nextImage = () => {
    changeImage((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    changeImage(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning, images.length]); 

  return (
    <main className="h-screen w-full relative overflow-hidden bg-black">
      {/* ซ้อนภาพและเฟด Opacity */}
      {images.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${img}')` }}
        />
      ))}
      
      {/* เลเยอร์สีดำโปร่งแสง */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* พื้นที่กดซีกซ้าย */}
      <div 
        onClick={prevImage}
        className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-pointer flex items-center justify-start pl-4 md:pl-10 group"
      >
        <span className="text-white/30 group-hover:text-white text-5xl md:text-7xl transition-colors drop-shadow-lg">
          ‹
        </span>
      </div>

      {/* พื้นที่กดซีกขวา */}
      <div 
        onClick={nextImage}
        className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-pointer flex items-center justify-end pr-4 md:pr-10 group"
      >
        <span className="text-white/30 group-hover:text-white text-5xl md:text-7xl transition-colors drop-shadow-lg">
          ›
        </span>
      </div>

      {/* Content ตรงกลาง */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl">
          EXQUISITE DINING STARTS HERE
        </h1>
        <p className="text-lg md:text-2xl mb-16 max-w-3xl text-gray-100 drop-shadow-md">
          Discover the finest culinary gems in town and book your table seamlessly.
        </p>

        <Link href="/restaurants" className="mb-12 relative z-30">
          <button className="bg-[#5C5CFF] text-white px-14 py-5 text-xl font-bold hover:bg-blue-600 transition-all duration-300 shadow-2xl rounded-full">
            EXPLORE RESTAURANTS
          </button>
        </Link>
        
        {/* จุดบอกตำแหน่งภาพ (Dots) */}
        <div className="flex space-x-2 absolute bottom-10 z-30">
          {images.map((_, index) => (
            <div 
              key={index}
              onClick={() => changeImage(index)}
              className={`h-3 rounded-full transition-all cursor-pointer ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}