import TopMenu from '@/components/TopMenu';
import LoginForm from '@/components/LoginForm';

// หน้านี้ไม่จำเป็นต้องเป็น 'use client' แล้วเพราะไม่มี State
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      <TopMenu />

      <main className="grow flex items-center justify-center p-6 pt-24">
        {/* เรียกใช้งานฟอร์มที่เราแยกไว้ */}
        <LoginForm />
      </main>
    </div>
  );
}