"use client";
import { useState } from 'react';
import TopMenu from "@/components/TopMenu";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([
    { 
      id: "1", 
      name: "Restaurant Name", 
      address: "123 Main St, Bangkok", 
      info: "Authentic Italian Cuisine", 
      tel: "081-xxx-xxxx", 
      hours: "10:00 - 22:00",
      isEditing: false 
    },
  ]);

  // Function to add a new empty restaurant
  const addEmptyRestaurant = () => {
    const newEntry = {
      id: Date.now().toString(),
      name: "New Restaurant",
      address: "",
      info: "",
      tel: "",
      hours: "",
      isEditing: true // Starts in edit mode so you can fill it out immediately
    };
    setRestaurants([newEntry, ...restaurants]); // Adds to the top of the list
  };

  const handleEditToggle = (id: string) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, isEditing: !r.isEditing } : r));
  };

  const handleChange = (id: string, field: string, value: string) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDelete = (id: string) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6 text-black">
        <div className="w-full max-w-5xl bg-[#E5E5E5] rounded-xl p-10 shadow-lg">
          
          {/* HEADER SECTION WITH ADD BUTTON */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Restaurant Edit</h2>
            <button 
              onClick={addEmptyRestaurant}
              className="bg-white border-2 border-black px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm"
            >
              + Add Restaurant
            </button>
          </div>
          
          {/* SCROLLABLE VIEW BOX */}
          <div className="bg-white border border-gray-300 rounded-lg h-125 overflow-y-auto p-8 shadow-inner">
            {restaurants.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 italic">
                No restaurants found. Click "Add Restaurant" to begin.
              </div>
            ) : (
              restaurants.map((shop) => (
                <div key={shop.id} className="flex gap-8 bg-[#F9F9F9] p-6 border border-gray-200 rounded-xl mb-6 shadow-sm last:mb-0">
                  {/* Image Placeholder */}
                  <div className="w-56 h-36 bg-gray-300 rounded-lg shrink-0 flex items-center justify-center text-gray-500 font-bold">
                    IMAGE
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {shop.isEditing ? (
                      <input 
                        className="text-2xl font-bold w-full border-b-2 border-blue-400 bg-transparent outline-none mb-2" 
                        value={shop.name} 
                        onChange={(e) => handleChange(shop.id, 'name', e.target.value)}
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{shop.name}</h3>
                    )}
                    
                    {shop.isEditing ? (
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <input className="border p-2 rounded bg-white" value={shop.address} onChange={(e) => handleChange(shop.id, 'address', e.target.value)} placeholder="Address" />
                        <input className="border p-2 rounded bg-white" value={shop.info} onChange={(e) => handleChange(shop.id, 'info', e.target.value)} placeholder="Information" />
                        <input className="border p-2 rounded bg-white" value={shop.tel} onChange={(e) => handleChange(shop.id, 'tel', e.target.value)} placeholder="Telephone" />
                        <input className="border p-2 rounded bg-white" value={shop.hours} onChange={(e) => handleChange(shop.id, 'hours', e.target.value)} placeholder="Open-Close Time" />
                      </div>
                    ) : (
                      <div className="text-md text-gray-700 space-y-1">
                        <p><span className="font-bold text-black">Address:</span> {shop.address}</p>
                        <p><span className="font-bold text-black">Information:</span> {shop.info}</p>
                        <p><span className="font-bold text-black">Telephone:</span> {shop.tel}</p>
                        <p><span className="font-bold text-black">Time:</span> {shop.hours}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-3 w-32">
                    <button 
                      onClick={() => handleEditToggle(shop.id)}
                      className={`${shop.isEditing ? 'bg-green-600' : 'bg-blue-600'} text-white py-2 rounded-md font-bold hover:opacity-90 transition`}
                    >
                      {shop.isEditing ? "Save" : "Edit"}
                    </button>
                    <button 
                      onClick={() => handleDelete(shop.id)}
                      className="bg-red-600 text-white py-2 rounded-md font-bold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}