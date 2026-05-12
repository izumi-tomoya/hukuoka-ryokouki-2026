import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import NewTripForm from "@/features/trip/components/client/NewTripForm";

export default function NewTripPage() {
  return (
    <div className="bg-background min-h-screen pt-16 pb-20 md:pt-24">
      <Container className="max-w-2xl">
        <header className="mb-12 text-center md:mb-16">
          <h1 className="font-playfair text-foreground mb-4 text-4xl leading-tight font-black tracking-tight md:text-6xl">
            New Journey
          </h1>
          <p className="text-muted-foreground text-[10px] leading-relaxed font-bold tracking-[0.2em] uppercase md:text-xs">
            新しい冒険の記録を始めましょう
          </p>
        </header>

        <MagazineCard padding="lg" className="border-border/50 shadow-primary/5 shadow-2xl">
          <NewTripForm />
        </MagazineCard>

        <footer className="mt-12 text-center">
          <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-50">
            ふたりだけの特別な物語がここから始まります
          </p>
        </footer>
      </Container>
    </div>
  );
}
