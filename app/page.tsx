// app/page.tsx (or pages/index.tsx)
import MyMap from "@/components/map";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <Link href="/history" className="top-4 left-4 z-10 absolute bg-white hover:bg-gray-100 shadow-sm hover:shadow-lg px-2 py-2 border-none rounded-md text-gray-700 text-sm cursor-pointer">Check History</Link>
      <MyMap />
    </main>
  );
}
