"use client";
import { useState, useEffect } from 'react';
import TopMenu from "@/components/TopMenu";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/restaurants');
        const json = await response.json();
        // แปลงข้อมูลจาก DB ให้มีสถานะ isEditing สำหรับ UI
        const dataWithEditState = json.data.map((r: any) => ({ ...r, isEditing: false }));
        setRestaurants(dataWithEditState);
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const addEmptyRestaurant = () => {
    const newEntry = {
      id: Date.now().toString(), // ชั่วคราวสำหรับ Key
      name: "New Restaurant",
      address: "",
      description: "",
      region: "Bangkok",
      tel: "",
      openTime: "",
      closeTime: "",
      isEditing: true 
    };
    setRestaurants([newEntry, ...restaurants]);
  };

  const handleEditToggle = async (id: string, currentIsEditing: boolean) => {
  const shopToUpdate = restaurants.find(r => (r._id === id || r.id === id));

  if (currentIsEditing) {
    const token = localStorage.getItem('token');
    
    // Determine if we are Creating (POST) or Updating (PUT)
    const isNew = !shopToUpdate._id; 
    const url = isNew 
      ? 'http://localhost:5000/api/v1/restaurants' 
      : `http://localhost:5000/api/v1/restaurants/${id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: shopToUpdate.name,
          address: shopToUpdate.address,
          district: shopToUpdate.district || "Watthana", // Required
          province: shopToUpdate.province || "Bangkok", // Required
          postalcode: shopToUpdate.postalcode || "10110", // Required
          tel: shopToUpdate.tel,
          region: shopToUpdate.region || "Bangkok", // Required
          openTime: shopToUpdate.openTime,
          closeTime: shopToUpdate.closeTime,
          description: shopToUpdate.description
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Operation failed');

      alert(isNew ? "Created Successfully!" : "Update Successful!");
      
      // Refresh to get the real MongoDB _id and updated state
      window.location.reload(); 
      return;
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
      return;
    }
  }
  
  setRestaurants(restaurants.map(r => (r._id === id || r.id === id) ? { ...r, isEditing: !currentIsEditing } : r));
};

  const handleChange = (id: string, field: string, value: string) => {
    setRestaurants(restaurants.map(r => (r._id === id || r.id === id) ? { ...r, [field]: value } : r));
  };

  const handleDelete = async (id: string) => {
  const shopToDelete = restaurants.find(r => r._id === id || r.id === id);
  
  // If it's a temp entry not yet saved to DB, just remove from UI
  if (!shopToDelete?._id) {
    setRestaurants(restaurants.filter(r => r.id !== id));
    return;
  }

  if (window.confirm("Are you sure you want to delete this restaurant?")) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/restaurants/${shopToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setRestaurants(restaurants.filter(r => r._id !== shopToDelete._id));
        alert("Deleted successfully");
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      alert("Could not delete restaurant");
    }
  }
};

  if (loading) return <div className="p-24 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-white">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6 text-black">
        <div className="w-full max-w-5xl bg-[#E5E5E5] rounded-xl p-10 shadow-lg">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Restaurant Management</h2>
            <button 
              onClick={addEmptyRestaurant}
              className="bg-white border-2 border-black px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm"
            >
              + Add Restaurant
            </button>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg h-125 overflow-y-auto p-8 shadow-inner">
            {restaurants.map((shop) => {
              const shopId = shop._id || shop.id;
              return (
                <div key={shopId} className="flex gap-8 bg-[#F9F9F9] p-6 border border-gray-200 rounded-xl mb-6 shadow-sm last:mb-0">
                  <div className="w-56 h-36 bg-gray-300 rounded-lg shrink-0 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                    {shop.image ? <img src={shop.image} className="w-full h-full object-cover" /> : "IMAGE"}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    {shop.isEditing ? (
                      <input 
                        className="text-2xl font-bold w-full border-b-2 border-blue-400 bg-transparent outline-none mb-2" 
                        value={shop.name} 
                        onChange={(e) => handleChange(shopId, 'name', e.target.value)}
                      />
                    ) : (
                      <h3 className="text-2xl font-bold">{shop.name}</h3>
                    )}
                    
                    {shop.isEditing ? (
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <input className="border p-2 rounded bg-white" value={shop.address} onChange={(e) => handleChange(shopId, 'address', e.target.value)} placeholder="Address" />
                            <input className="border p-2 rounded bg-white" value={shop.description} onChange={(e) => handleChange(shopId, 'description', e.target.value)} placeholder="Information" />
                            <input className="border p-2 rounded bg-white" value={shop.tel} onChange={(e) => handleChange(shopId, 'tel', e.target.value)} placeholder="Telephone" />
                            
                            <div className="grid grid-cols-3 gap-2">
                            <input className="border p-2 rounded bg-white" value={shop.district || ""} onChange={(e) => handleChange(shopId, 'district', e.target.value)} placeholder="District" />
                            <input className="border p-2 rounded bg-white" value={shop.province || ""} onChange={(e) => handleChange(shopId, 'province', e.target.value)} placeholder="Province" />
                            <input className="border p-2 rounded bg-white" value={shop.postalcode || ""} onChange={(e) => handleChange(shopId, 'postalcode', e.target.value)} placeholder="Postal Code" />
                            </div>

                            <div className="flex gap-2">
                            <input className="border p-2 rounded bg-white w-1/2" value={shop.openTime} onChange={(e) => handleChange(shopId, 'openTime', e.target.value)} placeholder="Open Time" />
                            <input className="border p-2 rounded bg-white w-1/2" value={shop.closeTime} onChange={(e) => handleChange(shopId, 'closeTime', e.target.value)} placeholder="Close Time" />
                            </div>
                        </div>
                        ) : (
                        <div className="text-md text-gray-700 space-y-1">
                            <p><span className="font-bold text-black">Address:</span> {shop.address} {shop.district} {shop.province} {shop.postalcode}</p>
                            {/* Region is still displayed here even if it's not in the edit form */}
                            <p><span className="font-bold text-black">Region:</span> {shop.region || "Bangkok"}</p>
                            <p><span className="font-bold text-black">Information:</span> {shop.description}</p>
                            <p><span className="font-bold text-black">Telephone:</span> {shop.tel}</p>
                            <p><span className="font-bold text-black">Time:</span> {shop.openTime} - {shop.closeTime}</p>
                        </div>
                        )}
                  </div>

                  <div className="flex flex-col justify-center gap-3 w-32">
                    <button 
                      onClick={() => handleEditToggle(shopId, shop.isEditing)}
                      className={`${shop.isEditing ? 'bg-green-600' : 'bg-blue-600'} text-white py-2 rounded-md font-bold hover:opacity-90 transition`}
                    >
                      {shop.isEditing ? "Save" : "Edit"}
                    </button>
                    <button 
                      onClick={() => handleDelete(shopId)}
                      className="bg-red-600 text-white py-2 rounded-md font-bold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}