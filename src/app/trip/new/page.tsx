import NewTripForm from "@/features/trip/components/client/NewTripForm";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function NewTripPage() {
  return (
    <div className="min-h-screen bg-memoir-bg dark:bg-background pt-24 pb-12 transition-colors">
      <Container className="max-w-2xl">
        <SectionHeader 
          title="Create New Journey" 
          subtitle="新しい冒険の記録を始めましょう。" 
        />
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <NewTripForm />
        </div>
      </Container>
    </div>
  );
}
