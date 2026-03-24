import TopMenu from "@/components/TopMenu";
import Banner from "@/components/Banner";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <TopMenu />
      <Banner />
    </div>
  );
}
