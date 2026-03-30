import AsciiHero from "@/components/AsciiHero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

function Divider() {
  return (
    <div
      style={{
        maxWidth: 720,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: 32,
        paddingRight: 32,
      }}
    >
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <AsciiHero />
      <About />
      <Divider />
      <Projects />
      <Divider />
      <Experience />
      <Footer />
    </main>
  );
}
