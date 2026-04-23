import NewTripForm from "@/components/trip/client/NewTripForm";

export default function NewTripPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFC] p-6 md:p-12 max-w-2xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 mb-2">Create New Journey</h1>
        <p className="text-zinc-500">新しい冒険の記録を始めましょう。</p>
      </header>
      <NewTripForm />
    </main>
  );
}
