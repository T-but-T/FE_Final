import TopMenu from '@/components/TopMenu';
import Banner from '@/components/Banner'; // 🌟 Import Banner ที่เราเพิ่งสร้างเข้ามา

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <TopMenu />
      <Banner /> {/* 🌟 เรียกใช้งาน Banner ตรงนี้ */}
    </div>
  );
}