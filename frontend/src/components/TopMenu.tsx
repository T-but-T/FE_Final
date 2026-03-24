'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function TopMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //wait for backend
  const mockUserName = "Alice";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">

      {/* 🌟 ซ้าย: เปลี่ยนจาก div เป็น Link และชี้ href ไปที่ "/" (หน้า Main) */}
      <Link
        href="/"
        className="bg-gray-200 text-black px-8 py-2 font-medium text-lg rounded-sm hover:bg-gray-300 transition cursor-pointer"
      >
        Name
      </Link>

      {/* ขวา: ข้อมูล User และปุ่ม */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          {isLoggedIn && `User: ${mockUserName}`}
        </span>

        {isLoggedIn ? (
          <button
            onClick={() => setIsLoggedIn(false)}
            className="bg-gray-200 text-black px-4 py-1 text-sm hover:bg-white transition rounded-sm"
          >
            Log out
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-gray-200 text-black px-4 py-1 text-sm hover:bg-white transition rounded-sm">
              Sign up/Log in
            </button>
          </Link>
        )}
      </div>

    </nav>
  );
}