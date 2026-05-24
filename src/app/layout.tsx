import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Bodoni_Moda } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pranavpappu.dev"),
  title: "Pranav Pappu",
  description: "Builder / AI Researcher",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pranav Pappu",
    description: "Builder / AI Researcher",
    url: "/",
    siteName: "Pranav Pappu",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranav Pappu",
    description: "Builder / AI Researcher",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} ${bodoni.variable}`}>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#0a0a0a",
          color: "#f5f5f7",
          fontFamily:
            'var(--font-jakarta), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
          overflowX: "hidden",
          minHeight: "100vh",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
