import AsciiHero from "@/components/AsciiHero";
import CardDeck from "@/components/CardDeck";
import DeckCursor from "@/components/DeckCursor";
import DeskStrip from "@/components/DeskStrip";

export default function Home() {
  return (
    <main className="deck-page">
      <AsciiHero />
      <DeskStrip />
      <CardDeck />
      <DeckCursor />
    </main>
  );
}
