import Link from "next/link";
import { Plus } from "lucide-react";
import { getTrips } from "@/features/trip/api/tripActions";

export default async function PortalPage() {
  const trips = await getTrips();

  return (
    <main className="min-h-screen bg-[#FDFDFC] text-[#2D2D2D] p-6 md:p-12">
      <header className="mb-16 max-w-2xl">
        <h1 className="text-4xl font-light tracking-tight mb-3">Journeys</h1>
        <p className="text-zinc-500 text-base leading-relaxed">
          Create, organize, and revisit your travel experiences.
        </p>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <Link 
            key={trip.id} 
            href={`/trip/${trip.slug}`}
            className="group block p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1"
          >
            <div className="mb-8">
              <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">
                {new Date(trip.startDate).getFullYear()}
              </span>
              <h2 className="text-xl font-medium mt-2">{trip.title}</h2>
              <p className="text-sm text-zinc-500 mt-1">{trip.location}</p>
            </div>
          </Link>
        ))}
        
        {/* Create New Trip Placeholder */}
        <div className="p-8 rounded-[2.5rem] border border-dashed border-zinc-200 flex flex-col justify-center items-center text-center text-zinc-400">
          <Plus className="mb-4" />
          <p className="text-sm font-medium">Create a new journey</p>
        </div>
      </section>
    </main>
  );
}
