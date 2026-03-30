import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Pranav P",
  description: "Engineer / AI Researcher / Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
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
      </body>
    </html>
  );
}
