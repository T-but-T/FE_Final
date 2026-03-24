"use client";
import { useState, useEffect } from 'react';
import TopMenu from "@/components/TopMenu";

// 🌟 Import TimePickerDropdown ตัวใหม่ที่เราแยกไฟล์ไว้
import TimePickerDropdown from '@/components/TimePickerDropdown';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 ใช้ API URL จาก .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  // 1. ดึงข้อมูลการจองทั้งหมด
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/reservations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await response.json();

        if (json.success) {
          const dataWithEditState = json.data.map((res: any) => {
            const timeString = new Date(res.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            return {
              ...res,
              id: res._id, // แปลง _id เป็น id เพื่อให้เรียกใช้ง่ายๆ
              isEditing: false,
              displayTime: timeString,
              originalTime: timeString, // 🌟 เก็บค่าเวลาเดิมไว้ใช้ตอนกด Cancel
              rawDate: res.bookingDate, // 🌟 เก็บวันที่เดิมไว้ผสมกับเวลาตอน Save
            };
          });
          setReservations(dataWithEditState);
        }
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [API_URL]);

  const handleEditToggle = (id: string) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, isEditing: true } : res
    ));
  };

  const handleCancel = (id: string) => {
    // 🌟 กลับไปใช้เวลาเดิม (originalTime) เมื่อกดยกเลิก
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, isEditing: false, displayTime: res.originalTime } : res
    ));
  };

  const handleSave = async (id: string, currentTime: string) => {
    const currentRes = reservations.find(r => r.id === id);
    if (!currentRes) return;

    const token = localStorage.getItem('token');

    try {
      // 🌟 แปลงเวลา "10:30 AM" กลับไปเป็น ISO Date
      const [time, modifier] = currentTime.split(' ');
      let [hours, minutes] = time.split(':');
      let h = parseInt(hours, 10);
      if (modifier === 'PM' && h < 12) h += 12;
      if (modifier === 'AM' && h === 12) h = 0;

      const updatedDate = new Date(currentRes.rawDate);
      updatedDate.setHours(h, parseInt(minutes, 10));

      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingDate: updatedDate.toISOString() }),
      });

      if (!response.ok) throw new Error('Update failed');

      // อัปเดตข้อมูลในหน้าจอ
      setReservations(reservations.map(res =>
        res.id === id ? { ...res, isEditing: false, originalTime: currentTime, rawDate: updatedDate.toISOString() } : res
      ));
      alert("Reservation updated successfully!");
    } catch (error) {
      alert("Error updating reservation.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Do you want to cancel this reservation?")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setReservations(reservations.filter(res => res.id !== id));
        alert("Deleted successfully");
      }
    } catch (error) {
      alert("Could not delete reservation");
    }
  };

  const handleTimeUpdate = (id: string, newTime: string) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, displayTime: newTime } : res
    ));
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black font-bold">Loading Reservations...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6">
        <div className="w-full max-w-4xl bg-[#E5E5E5] rounded-xl p-12 shadow-lg min-h-[500px]">
          <h2 className="text-2xl font-bold mb-6">Reservation Management (Admin)</h2>

          {/* 🌟 เอา overflow-y-auto ออก เพื่อไม่ให้ทับ Dropdown */}
          <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-inner min-h-[300px]">
            {reservations.length > 0 ? reservations.map((res) => (
              <div key={res.id} className="relative flex flex-col sm:flex-row justify-between items-center bg-[#F9F9F9] p-5 border border-gray-200 rounded-lg mb-4 shadow-sm gap-4">

                <div className="flex flex-col text-center sm:text-left">
                  <span className="font-bold text-xl text-blue-700">{res.restaurant?.name || "Unknown Restaurant"}</span>
                  <span className="text-sm text-gray-500 italic">User: {res.user?.name || "Customer"}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 relative">
                  {res.isEditing ? (
                    <>
                      <TimePickerDropdown
                        initialTime={res.displayTime}
                        onTimeChange={(t) => handleTimeUpdate(res.id, t)}
                      />
                      <button
                        onClick={() => handleSave(res.id, res.displayTime)}
                        className="px-6 py-2 bg-black text-white font-bold rounded-lg border-2 border-black hover:bg-gray-800 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => handleCancel(res.id)}
                        className="px-6 py-2 bg-white text-gray-600 font-bold rounded-lg border-2 border-gray-400 hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-white border border-gray-300 px-5 py-2.5 rounded-lg font-bold shadow-sm text-blue-600 min-w-[120px] text-center">
                        {res.displayTime}
                      </div>
                      <button
                        onClick={() => handleEditToggle(res.id)}
                        className="px-8 py-2.5 bg-white text-black border-2 border-black font-bold hover:bg-gray-100 transition rounded-lg"
                      >
                        Edit
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center text-gray-400 font-medium">No reservations found</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}