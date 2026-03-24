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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // 1. Fetch User Profile
        const userRes = await fetch('http://localhost:5000/api/v1/auth/me', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();

        if (userData.success) {
          setUser(userData.data);
          
          // 2. Fetch Reservations for this user
          const resRes = await fetch('http://localhost:5000/api/v1/reservations', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
          });
          const resData = await resRes.json();
          if (resData.success) {
            // Map backend data to include your isEditing state
            const mappedReservations = resData.data.map((r: any) => ({
              id: r._id,
              restaurant: r.restaurant.name,
              time: new Date(r.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
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
  }, [router]);

  const handleEditToggle = async (id: string, isEditing: boolean, currentTime: string) => {
    if (isEditing) {
      // Logic for saving to backend
      const token = localStorage.getItem('token');
      try {
        // Note: You may need to combine currentTime with a Date object based on your API requirements
        await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ bookingDate: currentTime }) 
        });
      } catch (err) {
        console.error("Update error:", err);
      }
    }

    setReservations(reservations.map(res => 
      res.id === id ? { ...res, isEditing: !res.isEditing } : res
    ));
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/reservations/${id}`, {
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
    router.push('/login');
  };

  const handleTimeUpdate = (id: string, newTime: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, time: newTime } : res
    ));
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black font-bold">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6 text-black">
        <div className="w-full max-w-4xl bg-[#E5E5E5] rounded-xl p-12 relative shadow-lg min-h-112.5">
          
          <button 
            onClick={handleLogout}
            className="absolute top-8 right-8 bg-[#D9D9D9] border border-gray-400 px-6 py-1 rounded text-sm hover:bg-gray-300 transition shadow-sm"
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
            <div className="flex justify-center items-center gap-10 mt-12">
              <Link href="/admin/reservations">
                <button className="bg-white border-2 border-black rounded-xl px-12 py-6 text-gray-500 font-bold text-xl hover:bg-gray-50 transition min-w-60 shadow-sm">
                  Reservation list
                </button>
              </Link>
              <Link href="/admin/restaurants">
                <button className="bg-white border-2 border-black rounded-xl px-12 py-6 text-gray-500 font-bold text-xl hover:bg-gray-50 transition min-w-60 shadow-sm">
                  Restaurant list
                </button>
              </Link>
            </div>
          ) : (
            <div className="w-full">
              <h3 className="font-bold mb-4 text-xl">Reservation list (Max 3)</h3>
              <div className="bg-white border border-gray-300 rounded-lg h-70 overflow-y-auto p-4 shadow-inner">
                {reservations.length > 0 ? reservations.map((res) => (
                  <div key={res.id} className="flex justify-between items-center bg-[#F9F9F9] p-4 border border-gray-200 rounded mb-4 shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{res.restaurant}</span>
                      <span className="text-sm text-gray-500">User: {user.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {res.isEditing ? (
                        <TimePickerDropdown 
                          initialTime={res.time} 
                          onTimeChange={(newTime) => handleTimeUpdate(res.id, newTime)} 
                        />
                      ) : (
                        <div className="bg-white border border-gray-300 px-4 py-2 rounded font-medium shadow-sm">
                          {res.time}
                        </div>
                      )}

                      <button 
                        onClick={() => handleEditToggle(res.id, res.isEditing, res.time)}
                        className={`border border-black px-8 py-2 font-bold transition rounded ${res.isEditing ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {res.isEditing ? "Save" : "Edit"}
                      </button>
                      <button 
                        onClick={() => handleDelete(res.id)}
                        className="border border-black px-8 py-2 bg-white font-bold hover:bg-red-50 transition rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex items-center justify-center text-gray-400">No reservations yet</div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2 italic font-medium">Click Edit button first to edit time</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Keep your TimePickerDropdown exactly as it was below...

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
  }, [hour, minute, ampm]);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-blue-400 px-3 py-1.5 rounded cursor-pointer flex items-center gap-2 text-black font-medium"
      >
        <span>{hour}:{minute} {ampm}</span>
        <span className="text-[10px] text-gray-400">▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-gray-300 shadow-2xl rounded flex z-50 h-40 overflow-hidden">
          <div className="overflow-y-auto w-10 border-r border-gray-100 scrollbar-hide">
            {hours.map(h => (
              <div key={h} onClick={() => setHour(h)} className={`p-1.5 text-center cursor-pointer hover:bg-blue-50 ${hour === h ? 'bg-gray-200 font-bold' : ''}`}>{h}</div>
            ))}
          </div>
          <div className="overflow-y-auto w-10 border-r border-gray-100 scrollbar-hide">
            {minutes.map(m => (
              <div key={m} onClick={() => setMinute(m)} className={`p-1.5 text-center cursor-pointer hover:bg-blue-50 ${minute === m ? 'bg-gray-200 font-bold' : ''}`}>{m}</div>
            ))}
          </div>
          <div className="w-14 flex flex-col">
            {['AM', 'PM'].map(p => (
              <div key={p} onClick={() => setAmpm(p)} className={`p-1.5 text-center cursor-pointer hover:bg-blue-50 flex-1 flex items-center justify-center ${ampm === p ? 'bg-gray-200 font-bold' : ''}`}>{p}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}