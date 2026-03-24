"use client";
import { useState, useEffect } from 'react';
import TopMenu from "@/components/TopMenu";

export default function AdminReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลการจองทั้งหมด
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/v1/reservations', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await response.json();
        
        // ข้อมูลจาก Backend จะมี restaurant.name และ user.name (ถ้า Populate มาแล้ว)
        const dataWithEditState = json.data.map((res: any) => ({ 
          ...res, 
          isEditing: false,
          // แปลงวันที่/เวลาจาก DB มาเป็น Format ที่อ่านง่ายสำหรับ UI
          displayTime: new Date(res.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        }));
        setReservations(dataWithEditState);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  const handleEditToggle = async (id: string, currentIsEditing: boolean) => {
    if (currentIsEditing) {
      const token = localStorage.getItem('token');
      const resToUpdate = reservations.find(r => r._id === id);
      
      try {
        // 2. ส่งคำสั่ง UPDATE (PUT) ไปที่ Database
        const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            bookingDate: resToUpdate.bookingDate // ตรวจสอบว่า Format วันที่ถูกต้องตามที่ Backend ต้องการ
          }),
        });

        if (!response.ok) throw new Error('Update failed');
        alert("Reservation updated!");
      } catch (error) {
        alert("Error updating reservation");
        return;
      }
    }
    setReservations(reservations.map(res => res._id === id ? { ...res, isEditing: !currentIsEditing } : res));
  };

  const handleTimeUpdate = (id: string, newTime: string) => {
    setReservations(reservations.map(res => 
      res._id === id ? { ...res, displayTime: newTime } : res
    ));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Do you want to cancel this reservation?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setReservations(reservations.filter(res => res._id !== id));
          alert("Deleted successfully");
        }
      } catch (error) {
        alert("Could not delete reservation");
      }
    }
  };

  if (loading) return <div className="p-24 text-center">Loading Reservations...</div>;

  return (
    <div className="min-h-screen bg-white">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6 text-black">
        <div className="w-full max-w-4xl bg-[#E5E5E5] rounded-xl p-12 shadow-lg min-h-125">
          <h2 className="text-2xl font-bold mb-6">Reservation Management</h2>
          
          <div className="bg-white border border-gray-300 rounded-lg h-100 overflow-y-auto p-6 shadow-inner">
            {reservations.map((res) => (
              <div key={res._id} className="flex justify-between items-center bg-[#F9F9F9] p-4 border border-gray-200 rounded mb-4 shadow-sm">
                <div className="flex flex-col">
                  {/* แสดงชื่อร้านจากข้อมูลที่ Populate */}
                  <span className="font-bold text-xl">{res.restaurant?.name || "Unknown Restaurant"}</span>
                  <span className="text-md text-gray-500">User: {res.user?.name || "Customer"}</span>
                </div>

                <div className="flex items-center gap-4">
                  {res.isEditing ? (
                    <TimePickerDropdown 
                      initialTime={res.displayTime} 
                      onTimeChange={(t) => handleTimeUpdate(res._id, t)} 
                    />
                  ) : (
                    <div className="bg-white border border-gray-300 px-4 py-2 rounded font-medium shadow-sm text-lg">
                      {res.displayTime}
                    </div>
                  )}

                  <button 
                    onClick={() => handleEditToggle(res._id, res.isEditing)}
                    className={`border-2 border-black px-8 py-2 font-bold rounded transition ${res.isEditing ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                  >
                    {res.isEditing ? "Save" : "Edit"}
                  </button>
                  <button 
                    onClick={() => handleDelete(res._id)}
                    className="border-2 border-black px-8 py-2 bg-white text-red-600 font-bold hover:bg-red-50 transition rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// วางคอมโพเนนต์นี้ไว้ด้านล่างสุดของไฟล์ AdminReservations.tsx
function TimePickerDropdown({ initialTime, onTimeChange }: { initialTime: string, onTimeChange: (time: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // ป้องกัน Error กรณี initialTime ไม่มีค่าหรือรูปแบบผิด
  const timeParts = initialTime?.split(':') || ["12", "00 AM"];
  const minuteParts = timeParts[1]?.split(' ') || ["00", "AM"];

  const [hour, setHour] = useState(timeParts[0]);
  const [minute, setMinute] = useState(minuteParts[0]);
  const [ampm, setAmpm] = useState(minuteParts[1]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  // อัปเดตค่ากลับไปยังคอมโพเนนต์แม่เมื่อมีการเปลี่ยนเวลา
  useEffect(() => {
    onTimeChange(`${hour}:${minute} ${ampm}`);
  }, [hour, minute, ampm]);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-blue-400 px-3 py-1.5 rounded cursor-pointer flex items-center gap-2 text-black font-medium min-w-[120px] justify-between shadow-sm hover:border-blue-600 transition"
      >
        <span>{hour}:{minute} {ampm}</span>
        <span className="text-[10px] text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded flex z-50 h-40 overflow-hidden ring-1 ring-black ring-opacity-5">
          {/* ส่วนเลือกชั่วโมง */}
          <div className="overflow-y-auto w-12 border-r border-gray-100 scrollbar-hide">
            {hours.map(h => (
              <div key={h} onClick={() => setHour(h)} className={`p-1.5 text-center cursor-pointer text-sm hover:bg-blue-50 ${hour === h ? 'bg-blue-100 font-bold text-blue-700' : 'text-gray-700'}`}>{h}</div>
            ))}
          </div>
          {/* ส่วนเลือกนาที */}
          <div className="overflow-y-auto w-12 border-r border-gray-100 scrollbar-hide">
            {minutes.map(m => (
              <div key={m} onClick={() => setMinute(m)} className={`p-1.5 text-center cursor-pointer text-sm hover:bg-blue-50 ${minute === m ? 'bg-blue-100 font-bold text-blue-700' : 'text-gray-700'}`}>{m}</div>
            ))}
          </div>
          {/* ส่วนเลือก AM/PM */}
          <div className="w-16 flex flex-col bg-gray-50">
            {['AM', 'PM'].map(p => (
              <div key={p} onClick={() => setAmpm(p)} className={`p-1.5 text-center cursor-pointer text-xs hover:bg-blue-50 flex-1 flex items-center justify-center border-b last:border-0 ${ampm === p ? 'bg-blue-600 text-white font-bold' : 'text-gray-600'}`}>{p}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}