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
    // ดึงค่าจาก localStorage ทุกครั้งที่เปลี่ยนหน้า (pathname เปลี่ยน)
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedName = localStorage.getItem('userName');

    if (token) {
      setIsLoggedIn(true);
      // ตรวจสอบ Role ให้แน่ใจว่าเป็นค่าจากระบบจริงๆ
      setRole(storedRole || "user");
      // ถ้าไม่มีชื่อ ให้ใช้คำว่า Member หรือ User แทน Guest เพื่อความสวยงาม
      setUserName(storedName || "Member");
    } else {
      // ถ้าไม่มี Token ให้รีเซ็ตค่าทั้งหมดเป็นค่าว่าง
      setIsLoggedIn(false);
      setRole("");
      setUserName("");
    }
  }, [pathname]);

  const handleLogout = () => {
    // ล้างข้อมูลการจดจำทั้งหมดในเครื่อง
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    
    setIsLoggedIn(false);
    setRole("");
    setUserName("");

    // ดีดไปหน้าแรกและรีเฟรชสถานะ UI
    router.push('/');
    router.refresh(); 
    
    // บังคับเคลียร์แคชเบราว์เซอร์เล็กน้อยเพื่อให้เมนูเปลี่ยนทันที
    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black text-white shadow-md">

      {/* 🌟 ส่วนซ้าย: ปุ่มกลับหน้าหลัก */}
      <Link
        href="/"
        className="bg-gray-200 text-black px-8 py-2 font-bold text-lg rounded-sm hover:bg-gray-300 transition cursor-pointer"
      >
        Main
      </Link>

      {/* ส่วนขวา: ข้อมูลผู้ใช้และปุ่มต่างๆ */}
      <div className="flex items-center gap-8">

        {/* เมนู Info (แสดงเฉพาะตอน Login แล้ว) */}
        {isLoggedIn && (
          <Link
            href="/profile"
            className="text-sm font-semibold hover:text-gray-400 transition underline underline-offset-4"
          >
            Info
          </Link>
        )}

        {/* แสดงชื่อผู้ใช้แยกตาม Role: Admin หรือ User */}
        {isLoggedIn && (
          <span className="text-sm text-gray-300 font-medium">
            {role === "admin" ? `Admin: ${userName}` : `User: ${userName}`}
          </span>
        )}

        {/* ปุ่มสลับระหว่าง Log out กับ Sign up/Log in */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-200 hover:text-white transition underline underline-offset-4 cursor-pointer"
          >
            Log out
          </button>
        ) : (
          <Link 
            href="/login" 
            className="text-sm font-semibold hover:text-gray-400 transition underline underline-offset-4"
          >
            Sign up/Log in
          </Link>
        )}
      </div>

    </nav>
  );
}