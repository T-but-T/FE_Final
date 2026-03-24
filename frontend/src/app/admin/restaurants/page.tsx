"use client";
import { useState, useEffect, useCallback } from 'react';
import TopMenu from "@/components/TopMenu";

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌟 ใช้ API URL จาก .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  // 🌟 สร้างฟังก์ชันโหลดข้อมูลแยกออกมา เพื่อให้เรียกใช้ซ้ำได้ตอน Save เสร็จ
  const loadRestaurants = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/restaurants`);
      const json = await response.json();
      if (json.success) {
        const dataWithEditState = json.data.map((r: any) => ({ 
          ...r, 
          id: r._id, // ใช้ id เป็น Key หลัก
          isEditing: false,
          isNew: false,
          originalData: { ...r } // 🌟 เก็บค่าดั้งเดิมไว้ใช้ตอนกด Cancel
        }));
        setRestaurants(dataWithEditState);
      }
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const addEmptyRestaurant = () => {
    const newEntry = {
      id: `temp-${Date.now()}`, // ID ชั่วคราว
      name: "New Restaurant",
      address: "",
      district: "Watthana",
      province: "Bangkok",
      postalcode: "10110",
      description: "",
      region: "Bangkok",
      tel: "",
      openTime: "10:00 AM",
      closeTime: "10:00 PM",
      isEditing: true,
      isNew: true, // 🌟 แฟล็กบอกว่าเป็นของใหม่ ต้องใช้ POST
      originalData: null
    };
    setRestaurants([newEntry, ...restaurants]);
  };

  const handleEditToggle = (id: string) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, isEditing: true } : r));
  };

  const handleCancel = (id: string) => {
    const shop = restaurants.find(r => r.id === id);
    if (shop?.isNew) {
      // ถ้าเป็นของใหม่ที่ยังไม่ได้เซฟ แล้วกด Cancel ให้ลบทิ้งไปเลย
      setRestaurants(restaurants.filter(r => r.id !== id));
    } else {
      // ถ้าเป็นของเก่า ให้ดึง originalData กลับมาทับ
      setRestaurants(restaurants.map(r => 
        r.id === id ? { ...r.originalData, id: r.id, isEditing: false, originalData: r.originalData } : r
      ));
    }
  };

  const handleSave = async (id: string) => {
    const shopToUpdate = restaurants.find(r => r.id === id);
    if (!shopToUpdate) return;

    const token = localStorage.getItem('token');
    const url = shopToUpdate.isNew ? `${API_URL}/restaurants` : `${API_URL}/restaurants/${shopToUpdate._id}`;
    const method = shopToUpdate.isNew ? 'POST' : 'PUT';

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
          district: shopToUpdate.district || "Watthana",
          province: shopToUpdate.province || "Bangkok",
          postalcode: shopToUpdate.postalcode || "10110",
          tel: shopToUpdate.tel,
          region: shopToUpdate.region || "Bangkok",
          openTime: shopToUpdate.openTime,
          closeTime: shopToUpdate.closeTime,
          description: shopToUpdate.description
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Operation failed');

      alert(shopToUpdate.isNew ? "Created Successfully!" : "Update Successful!");
      
      // 🌟 โหลดข้อมูลใหม่จาก DB แบบเนียนๆ โดยไม่ต้อง Refresh หน้าเว็บ
      loadRestaurants(); 
      
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleChange = (id: string, field: string, value: string) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDelete = async (id: string) => {
    const shopToDelete = restaurants.find(r => r.id === id);
    
    // ถ้าเป็นตัวที่เพิ่งกด Add แล้วยังไม่ได้เซฟ ให้ลบจาก UI ได้เลย
    if (shopToDelete?.isNew) {
      setRestaurants(restaurants.filter(r => r.id !== id));
      return;
    }

    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/restaurants/${shopToDelete._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setRestaurants(restaurants.filter(r => r.id !== id));
          alert("Deleted successfully");
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        alert("Could not delete restaurant");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-black font-bold">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <TopMenu />
      <main className="flex items-center justify-center pt-24 p-6">
        <div className="w-full max-w-5xl bg-[#E5E5E5] rounded-xl p-10 shadow-lg min-h-[500px]">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Restaurant Management</h2>
            <button 
              onClick={addEmptyRestaurant}
              className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md active:scale-95"
            >
              + Add Restaurant
            </button>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-lg max-h-[600px] overflow-y-auto p-8 shadow-inner">
            {restaurants.map((shop) => (
              <div key={shop.id} className="flex flex-col md:flex-row gap-8 bg-[#F9F9F9] p-6 border border-gray-200 rounded-xl mb-6 shadow-sm relative">
                
                {/* Image Placeholder */}
                <div className="w-full md:w-56 h-40 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center text-gray-400 font-bold overflow-hidden border border-gray-300">
                  {shop.image ? <img src={shop.image} className="w-full h-full object-cover" alt="restaurant" /> : "NO IMAGE"}
                </div>
                
                {/* Details / Edit Form */}
                <div className="flex-1 space-y-3">
                  {shop.isEditing ? (
                    <input 
                      className="text-2xl font-bold w-full border-b-2 border-[#5C5CFF] bg-transparent outline-none mb-4 focus:border-blue-700 transition" 
                      value={shop.name} 
                      onChange={(e) => handleChange(shop.id, 'name', e.target.value)}
                      placeholder="Restaurant Name"
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-blue-700 mb-2">{shop.name}</h3>
                  )}
                  
                  {shop.isEditing ? (
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.address} onChange={(e) => handleChange(shop.id, 'address', e.target.value)} placeholder="Address" />
                      <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.description} onChange={(e) => handleChange(shop.id, 'description', e.target.value)} placeholder="Information Description" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.tel} onChange={(e) => handleChange(shop.id, 'tel', e.target.value)} placeholder="Telephone" />
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.region || ""} onChange={(e) => handleChange(shop.id, 'region', e.target.value)} placeholder="Region (e.g., Bangkok)" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.district || ""} onChange={(e) => handleChange(shop.id, 'district', e.target.value)} placeholder="District" />
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.province || ""} onChange={(e) => handleChange(shop.id, 'province', e.target.value)} placeholder="Province" />
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={shop.postalcode || ""} onChange={(e) => handleChange(shop.id, 'postalcode', e.target.value)} placeholder="Postal Code" />
                      </div>

                      <div className="flex gap-3">
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white w-1/2 focus:ring-2 focus:ring-blue-200 outline-none" value={shop.openTime} onChange={(e) => handleChange(shop.id, 'openTime', e.target.value)} placeholder="Open Time (e.g., 10:00 AM)" />
                        <input className="border border-gray-300 p-2.5 rounded-md bg-white w-1/2 focus:ring-2 focus:ring-blue-200 outline-none" value={shop.closeTime} onChange={(e) => handleChange(shop.id, 'closeTime', e.target.value)} placeholder="Close Time (e.g., 10:00 PM)" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 space-y-2">
                      <p><span className="font-bold text-gray-900">Address:</span> {shop.address} {shop.district} {shop.province} {shop.postalcode}</p>
                      <p><span className="font-bold text-gray-900">Region:</span> {shop.region || "Bangkok"}</p>
                      <p><span className="font-bold text-gray-900">Information:</span> {shop.description || "-"}</p>
                      <p><span className="font-bold text-gray-900">Telephone:</span> {shop.tel}</p>
                      <p><span className="font-bold text-gray-900">Time:</span> {shop.openTime} - {shop.closeTime}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col justify-end gap-3 w-full md:w-32 mt-4 md:mt-0">
                  {shop.isEditing ? (
                    <>
                      <button 
                        onClick={() => handleSave(shop.id)}
                        className="bg-black text-white py-2.5 px-4 rounded-md font-bold hover:bg-gray-800 transition flex-1 md:flex-none border-2 border-black"
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => handleCancel(shop.id)}
                        className="bg-white text-gray-600 py-2.5 px-4 rounded-md font-bold hover:bg-gray-100 transition flex-1 md:flex-none border-2 border-gray-400"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEditToggle(shop.id)}
                        className="bg-white text-black py-2.5 px-4 rounded-md font-bold hover:bg-gray-100 transition flex-1 md:flex-none border-2 border-black"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(shop.id)}
                        className="bg-white text-red-500 py-2.5 px-4 rounded-md font-bold hover:bg-red-50 transition flex-1 md:flex-none border-2 border-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}