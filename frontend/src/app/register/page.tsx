'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopMenu from '@/components/TopMenu';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tel, setTel] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // รีเซ็ต error ทุกครั้งที่กดปุ่ม

    // 🌟 1. เช็คความยาว Password (Client-side Validation)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return; // หยุดการทำงาน ไม่ยิง API
    }

    // 🌟 2. เช็คความยาวเบอร์โทร (เบื้องต้น)
    if (tel.length < 9) {
      setError('Please enter a valid telephone number.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          tel,
          role: 'user'
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful! Please login.');
        router.push('/login');
      } else {
        // กรณี Backend ตีกลับมา (เช่น Email ซ้ำ)
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Connection error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <TopMenu />

      <main className="grow flex items-center justify-center p-6 pt-24">
        <div className="bg-[#F3F4F6] w-full max-w-xl p-10 md:p-14 flex flex-col items-center gap-6 rounded-2xl shadow-xl border border-gray-200">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-5 items-center">

            {/* ส่วนแสดง Error สีแดง */}
            {error && (
              <div className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 animate-shake">
                {error}
              </div>
            )}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white px-5 py-4 text-lg border-2 border-transparent focus:border-[#5C5CFF] rounded-xl outline-none shadow-sm transition-all"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white px-5 py-4 text-lg border-2 border-transparent focus:border-[#5C5CFF] rounded-xl outline-none shadow-sm transition-all"
            />

            <input
              type="password"
              placeholder="Password (Min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // กันไว้อีกชั้นด้วย HTML attribute
              className="w-full bg-white px-5 py-4 text-lg border-2 border-transparent focus:border-[#5C5CFF] rounded-xl outline-none shadow-sm transition-all"
            />

            <input
              type="tel"
              placeholder="Telephone Number"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              required
              className="w-full bg-white px-5 py-4 text-lg border-2 border-transparent focus:border-[#5C5CFF] rounded-xl outline-none shadow-sm transition-all"
            />

            <button
              type="submit"
              className="w-full bg-[#5C5CFF] text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg mt-2"
            >
              Sign Up
            </button>

          </form>

          <div className="text-gray-600 text-sm mt-4 flex gap-2 items-center">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="text-[#5C5CFF] font-bold hover:underline hover:text-blue-800 transition-colors"
            >
              Log In
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}