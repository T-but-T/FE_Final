'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TopMenu from '@/components/TopMenu';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 🌟 Step 1: Login เพื่อเอา Token
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const token = data.token;
        localStorage.setItem('token', token);
        localStorage.setItem('role', data.role || 'user');

        // 🌟 Step 2: ยิงไปดึงข้อมูล Profile ของเราจริงๆ เพื่อเอา "ชื่อ" (Name)
        // หมายเหตุ: เช็คกับเพื่อนว่า endpoint ดึงข้อมูลตัวเองคือ /auth/me หรือเปล่า
        try {
          const profileRes = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          });
          const profileData = await profileRes.json();
          
          if (profileData.success) {
            // บันทึกชื่อจริงที่ได้จาก Database ลงไป
            localStorage.setItem('userName', profileData.data.name);
          } else {
            localStorage.setItem('userName', 'Member');
          }
        } catch (profileErr) {
          console.error('Fetch profile error:', profileErr);
          localStorage.setItem('userName', 'Member');
        }

        // 🌟 Step 3: เคลียร์ทุกอย่างแล้วไปหน้าแรก
        router.push('/');
        router.refresh();
        
        // บังคับเปลี่ยนหน้าเพื่อความชัวร์ในการดึงค่าใหม่
        setTimeout(() => {
          window.location.href = "/";
        }, 100);

      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Internal server error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <TopMenu />

      <main className="grow flex items-center justify-center p-6 pt-24">
        <div className="bg-[#F3F4F6] w-full max-w-xl p-10 md:p-14 flex flex-col items-center gap-6 rounded-2xl shadow-xl border border-gray-200">
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5 items-center">
            
            {error && (
              <div className="w-full bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium border border-red-200">
                {error}
              </div>
            )}

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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white px-5 py-4 text-lg border-2 border-transparent focus:border-[#5C5CFF] rounded-xl outline-none shadow-sm transition-all"
            />

            <button
              type="submit"
              className="w-full bg-[#5C5CFF] text-white py-4 rounded-xl text-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg mt-2"
            >
              Login
            </button>
          </form>

          <div className="text-gray-600 text-sm mt-4 flex gap-2 items-center">
            <span>Don't have an account?</span>
            <Link
              href="/register"
              className="text-[#5C5CFF] font-bold hover:underline hover:text-blue-800 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}