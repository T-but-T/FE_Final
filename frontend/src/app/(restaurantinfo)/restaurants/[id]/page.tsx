'use client'
import { useState } from 'react';
import TopMenu from '@/components/TopMenu';

// 🌟 รับค่า params เป็น id
export default function ReservationPage({ params }: { params: { id: string } }) {

  const [currentPic, setCurrentPic] = useState(0);
  const mockPictures = ["Picture 1", "Picture 2", "Picture 3"];

  const handleNextPicture = () => {
    setCurrentPic((prev) => (prev + 1) % mockPictures.length);
  };

  const [reserveTime, setReserveTime] = useState("11:30");
  const [rating, setRating] = useState(0);

  return (
    <div className="min-h-screen bg-white text-black">
      <TopMenu />

      <main className="p-6 pt-24 max-w-5xl mx-auto flex flex-col gap-6 pb-20">

        {/* Header */}
        <div>
          {/* 🌟 ดึง params.id มาใช้งาน */}
          <h1 className="text-3xl font-medium mb-2">
            Restaurant Name {params.id && `(ID: ${params.id})`}
          </h1>
          <div className="flex items-center gap-2 text-xl">
            <div className="text-gray-300 tracking-widest">
              <span className="text-black">★</span><span className="text-black">★</span>
              <span className="text-black">★</span><span className="text-black">★</span>
              <span>★</span>
            </div>
            <span className="text-base text-gray-700 font-medium">(4.5)</span>
          </div>
        </div>

        {/* Section รูปภาพ และ กล่องจอง */}
        <div className="flex flex-col md:flex-row gap-8 w-full mt-4">
          <div className="w-full md:w-1/2 flex items-center gap-4">
            <div className="bg-[#D9D9D9] w-full aspect-[4/3] flex items-center justify-center text-xl relative">
              {mockPictures[currentPic]}
            </div>
            <button
              onClick={handleNextPicture}
              className="text-3xl text-black hover:text-gray-500 transition-transform active:scale-90"
              title="click to next picture"
            >
              →
            </button>
          </div>

          <div className="w-full md:w-1/2 flex items-center">
            <div className="bg-[#D9D9D9] p-10 w-[300px] flex flex-col items-center gap-6 rounded-sm">
              <div className="bg-white px-4 py-2 w-full flex items-center gap-3 border border-gray-300">
                <span className="text-xl">🕒</span>
                <input
                  type="time"
                  value={reserveTime}
                  onChange={(e) => setReserveTime(e.target.value)}
                  className="w-full outline-none bg-transparent"
                />
              </div>
              <button
                onClick={() => alert(`Reserved for ${reserveTime}`)}
                className="bg-white px-8 py-2 border border-gray-300 font-medium hover:bg-gray-100 transition shadow-sm"
              >
                reserve
              </button>
            </div>
          </div>
        </div>

        {/* Section Review */}
        <div className="mt-12 flex flex-col gap-2">
          <div className="text-lg font-medium">Review</div>
          <div className="flex items-center gap-6">
            <div className="text-2xl tracking-widest cursor-pointer flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={star <= rating ? "text-black" : "text-gray-300 hover:text-gray-400"}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={() => alert(rating > 0 ? `Sent ${rating} stars review!` : 'Please select rating')}
              className="bg-[#D9D9D9] px-8 py-1 font-medium hover:bg-gray-300 transition"
            >
              Send
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}