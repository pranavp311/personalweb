import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Bodoni_Moda } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import ThemeToggle from "@/components/ThemeToggle";
import { themeCss } from "@/lib/theme";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme-preference";
import "./globals.css";
import "./fonts.css";

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

const themeInitScript = `try{const theme=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(theme==="light")document.documentElement.dataset.theme="light"}catch{}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      suppressHydrationWarning
      className={`${jakarta.variable} ${jetbrainsMono.variable} ${bodoni.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <style id="theme-tokens">{themeCss}</style>
      </head>
      <body>
        <ThemeToggle />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
