import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import NewTripForm from "@/features/trip/components/client/NewTripForm";

export default function NewTripPage() {
  return (
    <div className="min-h-screen bg-background pt-16 md:pt-24 pb-20">
      <Container className="max-w-2xl">
        <header className="mb-12 md:mb-16 text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight leading-tight">
            New Journey
          </h1>
          <p className="text-muted-foreground text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase leading-relaxed">
            新しい冒険の記録を始めましょう
          </p>
        </header>

        <MagazineCard padding="lg" className="border-border/50 shadow-2xl shadow-primary/5">
          <NewTripForm />
        </MagazineCard>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">
            ふたりだけの特別な物語がここから始まります
          </p>
        </footer>
      </Container>
    </div>
  );
}
