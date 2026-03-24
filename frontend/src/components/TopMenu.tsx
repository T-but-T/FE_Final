'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function TopMenu() {
  // Toggle isLoggedIn to true to see the "User/Admin" link
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [role, setRole] = useState("admin"); // Change to "user" to test User Info
  
  const mockUserName = "Alice";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">

      {/* 🌟 Left: Logo/Home Link */}
      <Link
        href="/"
        className="bg-gray-200 text-black px-8 py-2 font-medium text-lg rounded-sm hover:bg-gray-300 transition cursor-pointer"
      >
        Main
      </Link>

      {/* Right: User Info and Buttons */}
      <div className="flex items-center gap-6">
        
        {/* 🧪 TEST LINK: Click "User/Admin" to go to the Info Page */}
        {isLoggedIn && (
          <Link 
            href="/profile" 
            className="text-sm font-semibold hover:text-gray-400 transition underline underline-offset-4"
          >
            {role === "admin" ? "Admin" : "User"}/Info
          </Link>
        )}

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