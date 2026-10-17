import AsciiHero from "@/components/AsciiHero";
import CardDeck from "@/components/CardDeck";
import DeskStrip from "@/components/DeskStrip";

export default function Home() {
  return (
    <main className="deck-page">
      <AsciiHero />
      <DeskStrip />
      <CardDeck />
    </main>
  );
}
