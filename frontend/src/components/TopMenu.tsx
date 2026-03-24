'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function TopMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");
  
  const router = useRouter();
  const pathname = usePathname(); // Detects page changes to update login status

  useEffect(() => {
    // Check localStorage for real auth data
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    
    // Note: In a real app, you'd store the name in localStorage 
    // or fetch it from /auth/me
    const storedName = localStorage.getItem('userName') || "User"; 

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole || "user");
      setUserName(storedName);
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]); // Refresh every time the user navigates to a new page

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    router.push('/');
  };

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
        
        {/* Real Dynamic Link based on role */}
        {isLoggedIn && (
          <Link 
            href="/profile" 
            className="text-sm font-semibold hover:text-gray-400 transition underline underline-offset-4"
          >
            {role === "admin" ? "Admin" : "User"}/Info
          </Link>
        )}

        <span className="text-sm text-gray-300">
          {isLoggedIn && `User: ${userName}`}
        </span>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-black px-4 py-1 text-sm hover:bg-white transition rounded-sm font-medium"
          >
            Log out
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-gray-200 text-black px-4 py-1 text-sm hover:bg-white transition rounded-sm font-medium">
              Sign up/Log in
            </button>
          </Link>
        )}
      </div>

    </nav>
  );
}