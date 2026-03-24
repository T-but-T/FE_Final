'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function TopMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('userName') || "Guest";

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole || "user");
      setUserName(storedName);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    router.push('/');
    router.refresh(); // บังคับให้หน้าเว็บอัปเดตสถานะใหม่ทั้งหมด
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">

      {/* 🌟 Left: Logo/Home Link */}
      <Link
        href="/"
        className="bg-gray-200 text-black px-8 py-2 font-bold text-lg rounded-sm hover:bg-gray-300 transition cursor-pointer"
      >
        Main
      </Link>

      {/* Right: User Info and Buttons */}
      <div className="flex items-center gap-8">

        {isLoggedIn && (
          <Link
            href="/profile"
            className="text-sm font-semibold hover:text-gray-400 transition underline underline-offset-4"
          >
            Info
          </Link>
        )}

        {isLoggedIn && (
          <span className="text-sm text-gray-300 font-medium">
            {role === "admin" ? `Admin: ${userName}` : `User: ${userName}`}
          </span>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-200 hover:text-white transition underline underline-offset-4 cursor-pointer"
          >
            Log out
          </button>
        ) : (
          <Link href="/login" className="text-sm font-semibold hover:text-gray-400 transition underline underline-offset-4">
            Sign up/Log in
          </Link>
        )}
      </div>

    </nav>
  );
}