"use client";
import { useState } from "react";

export default function ReviewBox() {
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    alert(rating > 0 ? `Sent ${rating} stars review!` : 'Please select rating');
  };

  return (
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
          onClick={handleSubmit}
          className="bg-gray-800 text-white px-10 py-2 rounded-full font-medium hover:bg-black transition-all active:scale-95"
        >
          Send Review
        </button>
      </div>
    </div>
  );
}