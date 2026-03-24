export default function RestaurantInfo({ restaurant }: { restaurant: any }) {
  if (!restaurant) return null;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm mt-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">About this Restaurant</h3>
      <p className="text-gray-700 leading-relaxed mb-6">
        {restaurant.description || "No description available."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <span className="text-lg">📍</span>
          <div>
            <span className="font-bold text-gray-900 block">Address</span>
            {restaurant.address} {restaurant.district} {restaurant.province} {restaurant.postalcode}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-lg">📞</span>
          <div>
            <span className="font-bold text-gray-900 block">Telephone</span>
            {restaurant.tel}
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-lg">🕒</span>
          <div>
            <span className="font-bold text-gray-900 block">Operating Hours</span>
            {restaurant.openTime} - {restaurant.closeTime}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-lg">🌍</span>
          <div>
            <span className="font-bold text-gray-900 block">Region</span>
            {restaurant.region || "Bangkok"}
          </div>
        </div>
      </div>
    </div>
  );
}