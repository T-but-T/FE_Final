import Link from 'next/link';
import TopMenu from '@/components/TopMenu';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <TopMenu />
      <main className="p-6 pt-24 h-screen">
        <div className="bg-gray-300 border border-gray-400 w-full h-full relative flex flex-col items-center justify-end pb-16">
          <Link href="/list" className="z-10 mb-4">
            <button className="bg-[#5C5CFF] text-white px-12 py-4 text-lg hover:bg-blue-600 transition shadow-sm">
              View list button
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}