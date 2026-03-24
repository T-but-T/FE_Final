"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopMenu from '@/components/TopMenu';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const userRes = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();

        if (userData.success) {
          setUser(userData.data);
          const resRes = await fetch(`${API_URL}/reservations`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          });
          const resData = await resRes.json();
          if (resData.success) {
            const mappedReservations = resData.data.map((r: any) => ({
              id: r._id,
              restaurant: r.restaurant?.name || 'Unknown Restaurant',
              rawDate: r.bookingDate,
              time: new Date(r.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
              originalTime: new Date(r.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }), 
              isEditing: false
            }));
            setReservations(mappedReservations);
          }
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, API_URL]);

  const handleEditToggle = (id: string) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, isEditing: true } : res
    ));
  };

  const handleCancel = (id: string) => {
    // 🌟 1. เมื่อกด Cancel ให้กลับไปใช้เวลาเดิม (originalTime) และปิดโหมด Edit
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, isEditing: false, time: res.originalTime } : res
    ));
  };

  const handleSave = async (id: string, currentTime: string) => {
    const currentRes = reservations.find(r => r.id === id);
    if (!currentRes) return;

    const token = localStorage.getItem('token');
    try {
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookingDate: updatedDate.toISOString() })
      });

      if (!response.ok) throw new Error('Update failed');
      
      // 🌟 2. เมื่อ Save สำเร็จ ให้อัปเดตค่าเวลาใหม่, ปิดโหมด Edit และอัปเดต originalTime
      setReservations(reservations.map(res =>
        res.id === id ? { ...res, isEditing: false, originalTime: currentTime, rawDate: updatedDate.toISOString() } : res
      ));
      alert('Update successful!');
    } catch (err) {
      console.error("Update error:", err);
      alert('Could not update reservation.');
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const res = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setReservations(reservations.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const handleTimeUpdate = (id: string, newTime: string) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, time: newTime } : res
    ));
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black font-bold">Loading Profile...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6">
        <div className="w-full max-w-4xl bg-[#E5E5E5] rounded-xl p-12 relative shadow-lg">

          <button
            onClick={handleLogout}
            className="absolute top-8 right-8 bg-white border border-gray-400 px-6 py-1.5 rounded text-sm font-bold hover:bg-gray-100 transition shadow-sm"
          >
            Log Out
          </button>

          <div className="space-y-4 mb-10 text-lg">
            <p className="font-semibold text-[#4F4F4F]">Username: <span className="ml-4 text-black font-medium">{user.name}</span></p>
            <p className="font-semibold text-[#4F4F4F]">Email: <span className="ml-4 text-black font-medium">{user.email}</span></p>
            <p className="font-semibold text-[#4F4F4F]">Tel: <span className="ml-4 text-black font-medium">{user.tel}</span></p>
          </div>

          <hr className="border-gray-300 mb-8" />

          {user.role === 'admin' ? (
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
              <Link href="/admin/reservations">
                <button className="bg-white border-2 border-black rounded-xl px-12 py-6 text-gray-700 font-bold text-xl hover:bg-gray-50 transition min-w-[280px] shadow-sm">
                  Reservation list
                </button>
              </Link>
              <Link href="/admin/restaurants">
                <button className="bg-white border-2 border-black rounded-xl px-12 py-6 text-gray-700 font-bold text-xl hover:bg-gray-50 transition min-w-[280px] shadow-sm">
                  Restaurant list
                </button>
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <h3 className="font-bold mb-4 text-xl">My Reservations (Max 3)</h3>
              
              {/* 🌟 3. เอา overflow-y-auto ออก เพื่อไม่ให้มันตัด Dropdown ทิ้ง */}
              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-inner min-h-[300px]">
                {reservations.length > 0 ? reservations.map((res) => (
                  <div key={res.id} className="relative flex flex-col sm:flex-row justify-between items-center bg-[#F9F9F9] p-5 border border-gray-200 rounded-lg mb-4 shadow-sm gap-4">
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="font-bold text-xl text-blue-700">{res.restaurant}</span>
                      <span className="text-sm text-gray-500 italic">Reserved for: {user.name}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 relative">
                      {res.isEditing ? (
                        <>
                          <TimePickerDropdown
                            initialTime={res.time}
                            onTimeChange={(newTime) => handleTimeUpdate(res.id, newTime)}
                          />
                          <button
                            onClick={() => handleSave(res.id, res.time)}
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
                            {res.time}
                          </div>
                          <button
                            onClick={() => handleEditToggle(res.id)}
                            className="px-8 py-2.5 bg-white text-black border-2 border-black font-bold hover:bg-gray-100 transition rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="px-6 py-2.5 bg-white border-2 border-red-500 text-red-500 font-bold hover:bg-red-50 transition rounded-lg"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-gray-400 font-medium">No reservations found</div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* --- CUSTOM DROPDOWN COMPONENT --- */
function TimePickerDropdown({ initialTime, onTimeChange }: { initialTime: string, onTimeChange: (time: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hour, setHour] = useState(initialTime.split(':')[0]);
  const [minute, setMinute] = useState(initialTime.split(':')[1].split(' ')[0]);
  const [ampm, setAmpm] = useState(initialTime.split(' ')[1]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  useEffect(() => {
    onTimeChange(`${hour}:${minute} ${ampm}`);
  }, [hour, minute, ampm, onTimeChange]);

  return (
    // 🌟 4. ใช้ relative ให้ TimePicker เป็นจุดอ้างอิง และปรับ z-index ให้สูงที่สุด
    <div className="relative z-[9999]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-[#5C5CFF] px-4 py-2 rounded-lg cursor-pointer flex items-center gap-3 text-black font-bold shadow-sm hover:border-blue-700 transition min-w-[130px]"
      >
        <span>{hour}:{minute} {ampm}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </div>

      {isOpen && (
        // 🌟 5. ใช้ absolute และเลื่อนลงมา (top-full mt-1) หรือจะดันขึ้นบนก็ได้ถ้าที่ข้างล่างไม่พอ
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-300 shadow-2xl rounded-xl flex h-48 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-y-auto w-12 border-r border-gray-100 scrollbar-hide py-1 bg-white">
            {hours.map(h => (
              <div key={h} onClick={() => setHour(h)} className={`p-2 text-center cursor-pointer hover:bg-blue-50 text-sm ${hour === h ? 'bg-[#5C5CFF] text-white font-bold' : ''}`}>{h}</div>
            ))}
          </div>
          <div className="overflow-y-auto w-12 border-r border-gray-100 scrollbar-hide py-1 bg-white">
            {minutes.map(m => (
              <div key={m} onClick={() => setMinute(m)} className={`p-2 text-center cursor-pointer hover:bg-blue-50 text-sm ${minute === m ? 'bg-[#5C5CFF] text-white font-bold' : ''}`}>{m}</div>
            ))}
          </div>
          <div className="w-16 flex flex-col py-1 bg-white">
            {['AM', 'PM'].map(p => (
              <div key={p} onClick={() => setAmpm(p)} className={`p-2 text-center cursor-pointer hover:bg-blue-50 flex-1 flex items-center justify-center text-sm font-bold ${ampm === p ? 'bg-[#5C5CFF] text-white' : ''}`}>{p}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}