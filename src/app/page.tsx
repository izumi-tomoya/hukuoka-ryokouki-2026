import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getTrips } from '@/features/trip/api/tripActions';

export default async function PortalPage() {
  const trips = await getTrips();

  return (
    <main className="min-h-screen bg-stone-50 p-6 md:p-12">
      <header className="mb-16 max-w-2xl">
        <h1 className="font-playfair text-5xl font-extrabold text-stone-900 mb-4 tracking-tight">
          Journeys
        </h1>
        <p className="text-stone-500 text-sm font-medium leading-relaxed">
          Create, organize, and revisit your travel experiences.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/trip/${trip.slug}`}
            className="group block p-10 rounded-[2.5rem] bg-white border border-stone-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1.5 hover:border-rose-200"
          >
            <div className="mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] text-rose-400 uppercase">
                {new Date(trip.startDate).getFullYear()}
              </span>
              <h2 className="font-playfair text-2xl font-bold text-stone-900 mt-3">{trip.title}</h2>
              <p className="text-sm font-medium text-stone-500 mt-2 mb-4">{trip.location}</p>
            </div>
          </Link>
        ))}

        {/* Create New Trip Link */}
        <Link
          href="/trip/new"
          className="p-10 rounded-[2.5rem] border-2 border-dashed border-stone-200 flex flex-col justify-center items-center text-center text-stone-400 hover:border-rose-300 hover:text-rose-500 transition-colors"
        >
          <Plus className="mb-4" />
          <p className="text-sm font-bold tracking-widest uppercase">Create New</p>
        </Link>
      </section>
    </main>
  );
}
