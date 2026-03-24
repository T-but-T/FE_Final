'use client'
import { useState } from 'react';
import Link from 'next/link';
import TopMenu from '@/components/TopMenu';

export default function RegisterPage() {
  // สร้าง State มารับค่าทั้ง 4 ช่อง
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // จำลองการยิงข้อมูลไปสมัครสมาชิก (รอกรอก API Backend จริง)
    alert(`Registering user:\nName: ${name}\nEmail: ${email}\nPassword: ${password}\nTel: ${tel}`);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <TopMenu />

      {/* Main Content: จัดให้อยู่กึ่งกลางหน้าจอ */}
      <main className="grow flex items-center justify-center p-6 pt-24">

        {/* กล่องสีเทาตรงกลาง (ใช้คลาสเดียวกับหน้า Login เลยเพื่อให้ขนาดเท่ากัน) */}
        <div className="bg-[#D9D9D9] w-full max-w-2xl p-10 md:p-14 flex flex-col items-center gap-6 rounded-sm">

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-6 items-center">

            {/* 1. ช่องกรอก Name */}
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white px-6 py-4 text-lg border border-transparent focus:border-gray-400 outline-none shadow-sm"
            />

            {/* 2. ช่องกรอก Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white px-6 py-4 text-lg border border-transparent focus:border-gray-400 outline-none shadow-sm"
            />

            {/* 3. ช่องกรอก Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white px-6 py-4 text-lg border border-transparent focus:border-gray-400 outline-none shadow-sm"
            />

            {/* 4. ช่องกรอก Tel */}
            <input
              type="tel"
              placeholder="Tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              required
              className="w-full bg-white px-6 py-4 text-lg border border-transparent focus:border-gray-400 outline-none shadow-sm"
            />

            {/* ปุ่ม Sign up สีน้ำเงิน */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-16 py-3 mt-2 text-lg hover:bg-blue-700 transition shadow-sm w-fit"
            >
              Sign up
            </button>

          </form>

          {/* แถมลิงก์กลับไปหน้า Login ให้ด้วย (เผื่อผู้ใช้มีบัญชีอยู่แล้ว) */}
          <div className="mt-2 text-sm text-gray-700">
            Already have an account?{' '}
            <Link href="/login" className="hover:underline hover:text-black transition font-medium">
              Log in
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}