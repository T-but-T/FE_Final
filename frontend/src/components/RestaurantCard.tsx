import Link from "next/link";
import Image from "next/image";

interface RestaurantCardProps {
  venue: any;
  isLoggedIn: boolean;
}

export default function RestaurantCard({
  venue,
  isLoggedIn,
}: RestaurantCardProps) {
  const getMockRating = (id: string) => {
    const lastDigit = id ? parseInt(id.slice(-1), 16) : 5;
    const rating = 4 + (lastDigit % 10) / 10;
    return rating.toFixed(1);
  };

  const ratingScore = parseFloat(getMockRating(venue.id));
  const fullStars = Math.floor(ratingScore);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full border-b border-gray-200 pb-12 last:border-0">
      <div className="w-full md:w-1/3 flex flex-col">
        <div className="relative w-full aspect-[4/3] rounded-lg mb-4 overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
          <Image
            src={venue.image || "/img/default-restaurant.jpg"}
            alt={venue.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>

        <h2 className="text-2xl font-bold mb-1 text-gray-900">{venue.name}</h2>

        <div className="flex items-center gap-2 mb-4">
          <div className="text-yellow-400 text-lg flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < fullStars ? "text-yellow-400" : "text-gray-200"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            {ratingScore}
          </span>
        </div>

        {isLoggedIn ? (
          <Link href={`/restaurants/${venue.id}`}>
            <button className="bg-[#5C5CFF] hover:bg-blue-600 text-white font-bold py-2.5 px-8 rounded-md transition duration-300 w-fit text-sm shadow-md active:scale-95">
              Click to reserve
            </button>
          </Link>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button
              disabled
              className="bg-gray-200 text-gray-400 cursor-not-allowed font-bold py-2.5 px-8 rounded-md w-fit text-sm border border-gray-300"
            >
              Click to reserve
            </button>
            <p className="text-red-600 text-[13px] font-semibold animate-pulse flex items-center gap-1">
              <span>* Please</span>
              <Link
                href="/login"
                className="underline hover:text-red-800 transition-colors decoration-2"
              >
                login
              </Link>
              <span>to make a reservation</span>
            </p>
          </div>
        )}
      </div>

      <div className="w-full md:w-2/3 flex flex-col justify-center gap-5 text-gray-700">
        <div className="flex flex-col gap-1 border-l-4 border-gray-100 pl-4 py-1">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            Address
          </span>
          <p className="text-gray-800 font-medium">
            {venue.address} {venue.district} {venue.province}
          </p>
        </div>

        <div className="flex flex-col gap-1 border-l-4 border-gray-100 pl-4 py-1">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            Information
          </span>
          <p className="text-gray-600 leading-relaxed italic">
            {venue.description ||
              "No detailed information available at the moment."}
          </p>
        </div>

        <div className="flex flex-col gap-1 border-l-4 border-gray-100 pl-4 py-1">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            Telephone
          </span>
          <p className="text-[#5C5CFF] font-bold">{venue.tel}</p>
        </div>
      </div>
    </div>
  );
}
