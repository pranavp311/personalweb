import AsciiHero from "@/components/AsciiHero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

function SectionBreak() {
  return (
    <div
      style={{
        maxWidth: 900,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 32,
        paddingRight: 32,
        textAlign: "center",
        padding: "12px 32px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 7,
          letterSpacing: "0.5em",
          color: "rgba(255,102,0,0.12)",
          userSelect: "none",
        }}
      >
        · · · · · · · · · · · · · · · · · · · · · · · · ·
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <AsciiHero />
      <About />
      <SectionBreak />
      <Projects />
      <SectionBreak />
      <Experience />
      <SectionBreak />
      <Contact />
      <Footer />
    </main>
  );
}
