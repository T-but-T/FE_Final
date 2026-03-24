'use client'
import { useState } from 'react';
import Link from 'next/link';
import TopMenu from '@/components/TopMenu'; // นำ TopMenu มาใส่ให้เหมือนหน้าอื่นๆ

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรงนี้เอาไว้ต่อ API ยิงไปที่ Backend ครับ
    alert(`Logging in with: \nEmail: ${email} \nPassword: ${password}`);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <TopMenu />

      {/* Main Content: จัดให้อยู่กึ่งกลางหน้าจอ */}
      <main className="grow flex items-center justify-center p-6 pt-24">

        {/* กล่องสีเทาตรงกลาง */}
        <div className="bg-[#D9D9D9] w-full max-w-2xl p-12 md:p-16 flex flex-col items-center gap-6 rounded-sm">

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-6 items-center">

            {/* ช่องกรอก Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white px-6 py-4 text-lg border border-transparent focus:border-gray-400 outline-none shadow-sm"
            />

            {/* ช่องกรอก Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white px-6 py-4 text-lg border border-transparent focus:border-gray-400 outline-none shadow-sm"
            />

            {/* ปุ่ม Login สีน้ำเงิน */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-16 py-3 mt-2 text-lg hover:bg-blue-700 transition shadow-sm w-fit"
            >
              Login
            </button>

          </form>

          {/* 🌟 ลิงก์ไปหน้า Sign Up แบบที่นิยมใช้กัน */}
          <div className="text-gray-600 text-sm mt-4 flex gap-2">
            <span>Don't have an account?</span>
            <Link
              href="/register"
              className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition-colors"
            >
              Sign Up
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}