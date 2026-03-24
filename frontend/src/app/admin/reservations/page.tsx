"use client";
import { useState, useEffect } from 'react';
import TopMenu from "@/components/TopMenu";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([
    { id: "1", restaurant: "Pasta Place", user: "Alice", time: "11:30 AM", isEditing: false },
    { id: "2", restaurant: "Burger Bar", user: "Bob", time: "01:00 PM", isEditing: false },
  ]);

  const handleEditToggle = (id: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, isEditing: !res.isEditing } : res
    ));
  };

  const handleTimeUpdate = (id: string, newTime: string) => {
    setReservations(reservations.map(res => 
      res.id === id ? { ...res, time: newTime } : res
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6 text-black">
        <div className="w-full max-w-4xl bg-[#E5E5E5] rounded-xl p-12 shadow-lg min-h-125">
          <h2 className="text-2xl font-bold mb-6">Reservation Edit</h2>
          
          <div className="bg-white border border-gray-300 rounded-lg h-100 overflow-y-auto p-6 shadow-inner">
            {reservations.map((res) => (
              <div key={res.id} className="flex justify-between items-center bg-[#F9F9F9] p-4 border border-gray-200 rounded mb-4 shadow-sm">
                <div className="flex flex-col">
                  <span className="font-bold text-xl">{res.restaurant}</span>
                  <span className="text-md text-gray-500">User: {res.user}</span>
                </div>

                <div className="flex items-center gap-4">
                  {res.isEditing ? (
                    <TimePickerDropdown 
                      initialTime={res.time} 
                      onTimeChange={(t) => handleTimeUpdate(res.id, t)} 
                    />
                  ) : (
                    <div className="bg-white border border-gray-300 px-4 py-2 rounded font-medium shadow-sm text-lg">
                      {res.time}
                    </div>
                  )}

                  <button 
                    onClick={() => handleEditToggle(res.id)}
                    className={`border-2 border-black px-8 py-2 font-bold rounded transition ${res.isEditing ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                  >
                    {res.isEditing ? "Save" : "Edit"}
                  </button>
                  <button className="border-2 border-black px-8 py-2 bg-white font-bold hover:bg-red-50 transition rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 italic font-medium">Click Edit button first to edit time</p>
        </div>
      </main>
    </div>
  );
}

// Reuse the TimePickerDropdown component logic here...
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