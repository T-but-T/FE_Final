"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopMenu from '@/components/TopMenu';
import Link from 'next/link';

// 🌟 Import Component ตัวใหม่เข้ามาใช้งาน
import ReservationItem from '@/components/ReservationItem';

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

              <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-inner min-h-[300px]">
                {reservations.length > 0 ? reservations.map((res) => (
                  // 🌟 เรียกใช้ Component ที่เราเพิ่งแยกออกไป
                  <ReservationItem
                    key={res.id}
                    res={res}
                    userName={user.name}
                    onEditToggle={handleEditToggle}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onTimeUpdate={handleTimeUpdate}
                  />
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