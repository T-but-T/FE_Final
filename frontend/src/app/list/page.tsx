import TopMenu from '@/components/TopMenu';
import Link from 'next/link';

// 🌟 Mock Data: จำลองข้อมูลร้านอาหาร
const mockVenues = [
  {
    id: 1,
    name: "Restaurant Name 1",
    address: "123 สุขุมวิท กรุงเทพมหานคร 10110",
    information: "สถานที่จัดเลี้ยงขนาดใหญ่ บรรยากาศอบอุ่น เหมาะสำหรับงานแต่งและงานปาร์ตี้",
    telephone: "02-123-4567",
    time: "10:00 AM - 10:00 PM"
  },
  {
    id: 2,
    name: "Restaurant Name 2",
    address: "456 อารีย์ พญาไท กรุงเทพมหานคร 10400",
    information: "คาเฟ่และพื้นที่จัดกิจกรรมสไตล์มินิมอล มีโซน Outdoor ให้บริการ",
    telephone: "02-987-6543",
    time: "08:00 AM - 08:00 PM"
  },
  {
    id: 3,
    name: "Restaurant Name 3",
    address: "789 ทองหล่อ วัฒนา กรุงเทพมหานคร 10110",
    information: "ร้านอาหารหรูหราพร้อมห้องส่วนตัว สำหรับการคุยธุรกิจหรือดินเนอร์พิเศษ",
    telephone: "02-555-8888",
    time: "17:00 PM - 24:00 AM"
  }
];

export default function ListPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <TopMenu />

      <main className="p-6 pt-24 pb-10 max-w-5xl mx-auto flex flex-col gap-12">
        {mockVenues.map((venue) => (
          <div key={venue.id} className="flex flex-col md:flex-row gap-8 w-full border-b border-gray-300 pb-10">

            {/* ฝั่งซ้าย: รูปภาพ + ชื่อ + เรตติ้งดาว + ปุ่ม Reserve */}
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="bg-gray-300 w-full aspect-[4/3] rounded-sm mb-4"></div>

              <h2 className="text-2xl font-semibold mb-1">{venue.name}</h2>

              {/* เรตติ้งดาว (เติม mb-4 เพื่อเว้นระยะห่างจากปุ่ม) */}
              <div className="text-gray-300 text-xl tracking-widest mb-4">
                <span className="text-gray-400">★</span>
                <span className="text-gray-400">★</span>
                <span className="text-gray-400">★</span>
                <span className="text-gray-400">★</span>
                <span className="text-gray-200">★</span>
              </div>

              {/* 🌟 แก้ไขลิงก์ตรงนี้ */}
              <Link href={`/restaurant/${venue.id}`}>
                <button className="bg-[#5C5CFF] hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition duration-300 w-fit text-sm shadow-sm">
                  Click to reserve
                </button>
              </Link>
            </div>

            {/* ฝั่งขวา: รายละเอียด */}
            <div className="w-full md:w-2/3 flex flex-col justify-center gap-4 text-gray-700 text-sm md:text-base">
              <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                <span className="w-40 font-medium shrink-0 whitespace-nowrap">Address:</span>
                <span className="text-gray-600">{venue.address}</span>
              </div>
              <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                <span className="w-40 font-medium shrink-0 whitespace-nowrap">Information:</span>
                <span className="text-gray-600">{venue.information}</span>
              </div>
              <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                <span className="w-40 font-medium shrink-0 whitespace-nowrap">Telephone:</span>
                <span className="text-gray-600">{venue.telephone}</span>
              </div>
              <div className="flex items-start border-b border-dotted border-gray-400 pb-2">
                <span className="w-40 font-medium shrink-0 whitespace-nowrap">Open-Close Time:</span>
                <span className="text-gray-600">{venue.time}</span>
              </div>
            </div>

          </div>
        ))}
      </main>
    </div>
  );
}